import { Controller, Post, Body, UseInterceptors, UploadedFile, Headers, Get, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DiagnosticsService } from './diagnostics.service';

@Controller('api/diagnostics')
export class DiagnosticsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  @Post('symptoms')
  async predictSymptoms(
    @Body() body: { features: number[] },
    @Headers('x-session-uuid') sessionUuid: string,
  ) {
    if (!body.features || body.features.length !== 33) {
      throw new Error('Features array must contain exactly 33 binary elements.');
    }
    return this.diagnosticsService.predictSymptoms(body.features, sessionUuid);
  }

  @Post('blood-smear')
  @UseInterceptors(FileInterceptor('file'))
  async predictBloodSmear(
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-session-uuid') sessionUuid: string,
  ) {
    if (!file) {
      throw new Error('Image file is required.');
    }
    return this.diagnosticsService.predictBloodSmear(file, sessionUuid);
  }

  @Get('history/:uuid')
  async getHistory(@Param('uuid') uuid: string) {
    if (!uuid) {
      throw new Error('UUID is required to fetch history.');
    }
    return this.diagnosticsService.getHistory(uuid);
  }

  @Delete('history/:uuid')
  async clearHistory(@Param('uuid') uuid: string) {
    if (!uuid) {
      throw new Error('UUID is required to clear history.');
    }
    return this.diagnosticsService.clearHistory(uuid);
  }
}
