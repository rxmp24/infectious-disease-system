import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiagnosticsService {
  private readonly FASTAPI_URL = process.env.ML_SERVICE_URL || 'https://infectious-disease-ml.onrender.com';

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) { }

  async predictSymptoms(features: number[], sessionUuid: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.FASTAPI_URL}/predict/symptoms`, { features })
      );

      const data = response.data;

      // Save history
      if (sessionUuid) {
        await this.prisma.predictionHistory.create({
          data: {
            sessionUuid,
            type: 'SYMPTOM',
            inputs: JSON.stringify(features),
            diagnosis: data.disease,
            confidence: data.confidence,
          },
        });
      }

      return data;
    } catch (error) {
      throw new HttpException(
        'Error communicating with ML microservice.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async predictBloodSmear(file: Express.Multer.File, sessionUuid: string) {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, { filename: file.originalname });

      const response = await firstValueFrom(
        this.httpService.post(`${this.FASTAPI_URL}/predict/image`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        })
      );

      const data = response.data;

      // Save history
      if (sessionUuid) {
        await this.prisma.predictionHistory.create({
          data: {
            sessionUuid,
            type: 'BLOOD_SMEAR',
            inputs: file.originalname,
            diagnosis: data.result === 'Parasitized' ? 'Malaria Detected' : 'No Malaria Detected',
            confidence: data.confidence,
          },
        });
      }

      return data;
    } catch (error) {
      throw new HttpException(
        'Error communicating with ML microservice.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHistory(sessionUuid: string) {
    return this.prisma.predictionHistory.findMany({
      where: { sessionUuid },
      orderBy: { createdAt: 'desc' },
    });
  }

  async clearHistory(sessionUuid: string) {
    const { count } = await this.prisma.predictionHistory.deleteMany({
      where: { sessionUuid },
    });
    return { message: `Cleared ${count} record(s) successfully.`, count };
  }
}
