from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel, conlist
import joblib
import onnxruntime as ort
import numpy as np
from PIL import Image
import io
import os

app = FastAPI()

# Model Loading at Startup
try:
    # Resolve the root directory regardless of where Uvicorn is executed from
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    symptom_model_path = os.path.join(BASE_DIR, 'disease_prediction_model.pkl')
    malaria_model_path = os.path.join(BASE_DIR, 'malaria_model_clean.onnx')
    
    nb_model = joblib.load(symptom_model_path)
    onnx_session = ort.InferenceSession(malaria_model_path)
    print("Models loaded successfully.")
except Exception as e:
    print(f"Startup Model Loading Error: {e}")

class SymptomPayload(BaseModel):
    # Expect exactly 33 binary values
    features: conlist(int, min_length=33, max_length=33)

@app.post("/predict/symptoms")
async def predict_symptoms(payload: SymptomPayload):
    try:
        X = np.array([payload.features])
        prediction = nb_model.predict(X)[0]
        probabilities = nb_model.predict_proba(X)[0]
        
        classes = nb_model.classes_
        
        # Sort probabilities in descending order and get top 3
        sorted_indices = np.argsort(probabilities)[::-1]
        top_3_indices = sorted_indices[:3]
        
        differentials = [
            {"disease": str(classes[i]), "confidence": float(probabilities[i])}
            for i in top_3_indices
        ]
        
        symptom_count = sum(payload.features)
        insufficient_data = bool(symptom_count < 5)
        
        return {
            "disease": differentials[0]["disease"],
            "confidence": differentials[0]["confidence"],
            "differentials": differentials,
            "insufficient_data": insufficient_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        img = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Resize constraint enforced by prompt
        # Note: If the true ONNX tensor is 128x128, this shape mismatch will throw an internal ORT error.
        img = img.resize((128, 128))
        
        img_array = np.array(img).astype(np.float32)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0) # shape (1, 128, 128, 3)
        
        input_name = onnx_session.get_inputs()[0].name
        result = onnx_session.run(None, {input_name: img_array})
        probability = float(result[0][0][0])
        
        # Sigmoid output logic
        pred_class = "Parasitized" if probability > 0.5 else "Uninfected"
        confidence = probability if pred_class == "Parasitized" else 1.0 - probability
        
        return {"result": pred_class, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
