import {Module} from "@nestjs/common"
import {ConfigModule} from "@nestjs/config"
import { DrizzleModule } from "./database/drizzle.modue"
import { UserModule } from "./modules/users/user.module"
import { FavoriteModule } from "./modules/favorite/favorite.module"
import { MediaModule } from "./modules/media/media.module"



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        UserModule,
        MediaModule,
        FavoriteModule,
        DrizzleModule
    ],
})
export class AppModule {}