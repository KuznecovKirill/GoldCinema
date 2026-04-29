import { forwardRef, Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { DrizzleService } from "@/database/drizzle.service";
// import { ExternalApiModule } from "@/modules/external-api/external-api.module";
import { KeywordModule } from "@/modules/keyword/keyword.module";

import { SimilarModule } from "@/modules/similar/similar.module";
import { ReviewModule } from "@/modules/review/review.module";
import { FavoriteModule } from "@/modules/favorite/favorite.module";
import { UserModule } from "../users/user.module";
import { SwaggerModule } from "@/swagger/swagger.module";
import { ImageModule } from "../image/image.module";
import { MultimodalModule } from "../multimodal/multimodal.module";

@Module({
  imports: [
    KeywordModule,
    SwaggerModule,
    ImageModule,
    MultimodalModule,
    forwardRef(() => SimilarModule),
    ReviewModule,
    FavoriteModule,
    UserModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}