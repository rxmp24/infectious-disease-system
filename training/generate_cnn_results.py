import os
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report

# Hide verbose TensorFlow C++ logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def build_cnn_model(input_shape=(224, 224, 3)):
    """
    Builds a standard Convolutional Neural Network architecture.
    Includes a Rescaling layer to normalize pixel values (0-255 -> 0-1).
    """
    model = tf.keras.Sequential([
        # Data Normalization
        tf.keras.layers.Rescaling(1./255, input_shape=input_shape),
        
        # Convolutional Block 1
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2, 2),
        
        # Convolutional Block 2
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2, 2),
        
        # Convolutional Block 3
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2, 2),
        
        # Flatten and Dense Layers
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.5), # Prevent overfitting during our 15 epochs
        tf.keras.layers.Dense(1, activation='sigmoid') # Binary output for Parasitized vs Uninfected
    ])
    
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    return model

def plot_and_save_curves(history, save_path='cnn_training_curves.png'):
    """
    Plots the training and validation accuracy/loss curves and saves to disk.
    """
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    epochs_range = range(1, len(acc) + 1)

    plt.figure(figsize=(14, 6))
    
    # Subplot 1: Model Accuracy
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy', marker='o')
    plt.plot(epochs_range, val_acc, label='Validation Accuracy', marker='o')
    plt.title('CNN Model Accuracy (Malaria Detection)')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend(loc='lower right')
    plt.grid(True, linestyle='--', alpha=0.7)

    # Subplot 2: Binary Crossentropy Loss
    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss', marker='o')
    plt.plot(epochs_range, val_loss, label='Validation Loss', marker='o')
    plt.title('CNN Binary Crossentropy Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend(loc='upper right')
    plt.grid(True, linestyle='--', alpha=0.7)

    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"\n[SUCCESS] Visual artifact saved successfully as: {save_path}")
    plt.close()

def main():
    # 1. Dataset Configuration
    dataset_dir = 'malaria_cell_images'
    batch_size = 32
    img_height = 224
    img_width = 224
    epochs = 15

    # Determine absolute path to the dataset from the script execution context
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(base_dir, dataset_dir)

    if not os.path.exists(dataset_path):
        print(f"[ERROR] Dataset directory not found at: {dataset_path}")
        print("Please ensure the 'malaria_cell_images' folder is extracted in the root directory.")
        return

    print("Loading Training Dataset...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(img_height, img_width),
        batch_size=batch_size
    )

    print("Loading Validation Dataset...")
    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(img_height, img_width),
        batch_size=batch_size
    )

    class_names = train_ds.class_names
    print(f"Detected Classes: {class_names}")

    # Optimize datasets for performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # 2. Build and Train Model
    print("\nBuilding CNN Architecture...")
    model = build_cnn_model(input_shape=(img_height, img_width, 3))
    model.summary()

    print(f"\nCommencing Training for exactly {epochs} Epochs...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs
    )

    # 3. Generate Visual Artifact
    save_img_path = os.path.join(base_dir, 'cnn_training_curves.png')
    plot_and_save_curves(history, save_path=save_img_path)

    # 4. Generate Classification Report (Table 4.2 Output)
    print("\nEvaluating Model for Classification Report...")
    y_true = []
    y_pred_probs = []

    # Extract labels and predict probabilities iteratively 
    for images, labels in val_ds.unbatch():
        y_true.append(labels.numpy())
        # Expand dims to simulate a batch of 1
        pred = model.predict(tf.expand_dims(images, axis=0), verbose=0)
        y_pred_probs.append(pred[0][0])
    
    y_true = np.array(y_true)
    y_pred_probs = np.array(y_pred_probs)
    
    # Threshold at 0.5 for binary classification
    y_pred = (y_pred_probs > 0.5).astype(int)

    print("\n" + "="*60)
    print("                 CNN EVALUATION RESULTS (Table 4.2)")
    print("="*60)
    
    # Note: Keras image_dataset_from_directory sorts class folders alphabetically.
    # Usually: 0 -> Parasitized, 1 -> Uninfected
    print(classification_report(y_true, y_pred, target_names=class_names))
    print("="*60)

if __name__ == "__main__":
    main()
