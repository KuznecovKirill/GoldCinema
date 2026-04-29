import { Module } from '@nestjs/common';
import { MultimodalService } from './multimodal.service';
import { DrizzleService } from '@/database/drizzle.service';
import { KeywordModule } from '../keyword/keyword.module';

@Module({
    imports: [KeywordModule],
    providers: [MultimodalService, DrizzleService],
    exports: [MultimodalService],
})
export class MultimodalModule {}