import { forwardRef, Module } from '@nestjs/common';
import { SimilarService } from './similar.service';
import { SimilarController } from './similar.controller';
import { DrizzleService } from '@/database/drizzle.service';
import { SwaggerModule } from '@/swagger/swagger.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [SwaggerModule, forwardRef(() => MediaModule)],
  controllers: [SimilarController],
  providers: [SimilarService],
  exports: [SimilarService],
})
export class SimilarModule {}