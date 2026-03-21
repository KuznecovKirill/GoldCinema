import {Module} from "@nestjs/common"
import {ConfigModule} from "@nestjs/config"
import { DrizzleModule } from "./database/drizzle.modue"
import { UserModule } from "./modules/users/user.module"
import { FavoriteModule } from "./modules/favorite/favorite.module"
import { MediaModule } from "./modules/media/media.module"
import { SwaggerModule } from "./swagger/swagger.module"
import { KeywordModule } from "./modules/keyword/keyword.module"
import { ImageModule } from "./modules/image/image.module"
import { ReviewModule } from "./modules/review/review.module"
import { SimilarModule } from "./modules/similar/similar.module"



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        UserModule,
        MediaModule,
        FavoriteModule,
        DrizzleModule,
        SwaggerModule,
        KeywordModule,
        ImageModule,
        ReviewModule,
        SimilarModule,
    ],
})
export class AppModule {}