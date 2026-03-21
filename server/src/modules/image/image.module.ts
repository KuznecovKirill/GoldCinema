import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { DrizzleService } from '@/database/drizzle.service';
import { SwaggerModule } from '@/swagger/swagger.module';


@Module({
  imports: [SwaggerModule],
  providers: [ImageService, DrizzleService],
  exports: [ImageService],
})
export class ImageModule {}