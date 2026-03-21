// src/modules/swagger/swagger.module.ts
import { Module } from '@nestjs/common';
import { AxiosClient } from '@/axios/axiosClient';
import { SwaggerApiService } from './swagger.api';

@Module({
  providers: [AxiosClient, SwaggerApiService],
  exports: [SwaggerApiService],
})
export class SwaggerModule {}