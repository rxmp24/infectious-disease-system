Set-Location microservices

# Safely rename our existing payload folders
Rename-Item -Path api-gateway -NewName api-gateway-temp -ErrorAction silentlycontinue
Rename-Item -Path frontend -NewName frontend-temp -ErrorAction silentlycontinue

Write-Output "Scaffolding NestJS..."
# Scafold NestJS quietly
npx "@nestjs/cli" new api-gateway --package-manager npm --skip-git
Copy-Item -Path api-gateway-temp\src\* -Destination api-gateway\src -Recurse -Force

Set-Location api-gateway
npm install @nestjs/axios axios
npm install form-data
npm install -D @types/multer
Set-Location ..

Write-Output "Configuring NestJS App module and main.ts..."
$mainTsPath = "api-gateway\src\main.ts"
$mainTsContent = @"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 
  await app.listen(3001); 
}
bootstrap();
"@
Set-Content -Path $mainTsPath -Value $mainTsContent

$appModulePath = "api-gateway\src\app.module.ts"
$appModuleContent = @"
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosticsModule } from './diagnostics/diagnostics.module';

@Module({
  imports: [DiagnosticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
"@
Set-Content -Path $appModulePath -Value $appModuleContent

Write-Output "Scaffolding NextJS..."
# Generate NextJS app
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm --yes

# Restore our page payload
Copy-Item -Path frontend-temp\app\* -Destination frontend\app -Recurse -Force

# Clean up
Remove-Item -Path api-gateway-temp -Recurse -Force
Remove-Item -Path frontend-temp -Recurse -Force

Write-Output "Scaffolding Complete!"
