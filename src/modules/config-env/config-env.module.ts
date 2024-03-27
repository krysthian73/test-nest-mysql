import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';

@Module({
  imports: [
    ConfigModuleNest.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class ConfigModule {}
