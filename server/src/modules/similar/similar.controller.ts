import { Controller, Post, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SimilarService } from './similar.service';
import { CheckToken } from '@/middlewares/middleware';

@ApiTags('SIMILAR')
@Controller('api/similar')
@ApiBearerAuth()
@UseGuards(CheckToken)
export class SimilarController {
  constructor(private readonly similarService: SimilarService) {}

  @Post()
  @ApiOperation({ summary: 'Установить похожие медиа для заданного ID' })
  async setSimilar(@Body() id_media: number) {
    const similars = await this.similarService.setSimilarAndReturn(id_media);
    return { success: true, similars };
  }
}