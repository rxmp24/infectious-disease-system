import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosticsModule } from './diagnostics/diagnostics.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [DiagnosticsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
