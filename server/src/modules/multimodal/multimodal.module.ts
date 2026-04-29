import { Module } from '@nestjs/common';
import { MultimodalService } from './multimodal.service';
import { DrizzleService } from '@/database/drizzle.service';

@Module({
  providers: [MultimodalService, DrizzleService],
  exports: [MultimodalService],
})
export class MultimodalModule {}