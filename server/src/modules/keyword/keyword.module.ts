import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { DrizzleService } from '@/database/drizzle.service';
// Если нужен контроллер для поиска, добавить KeywordController

@Module({
  providers: [KeywordService],
  exports: [KeywordService],
})
export class KeywordModule {}