import {Module} from "@nestjs/common"
import {ConfigModule} from "@nestjs/config"
import { DrizzleModule } from "./database/drizzle.modue"
import { UserModule } from "./modules/users/user.module"



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        UserModule,
        DrizzleModule
    ],
})
export class AppModule {}