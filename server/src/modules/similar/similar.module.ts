import { Module } from '@nestjs/common';
import { SimilarService } from './similar.service';
import { SimilarController } from './similar.controller';
import { DrizzleService } from '@/database/drizzle.service';

@Module({
  controllers: [SimilarController],
  providers: [SimilarService],
  exports: [SimilarService],
})
export class SimilarModule {}