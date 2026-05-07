import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiagnosticsController } from './diagnostics.controller';
import { DiagnosticsService } from './diagnostics.service';

@Module({
  imports: [HttpModule],
  controllers: [DiagnosticsController],
  providers: [DiagnosticsService],
})
export class DiagnosticsModule {}
