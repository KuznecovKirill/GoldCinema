import {Module} from "@nestjs/common"
import {ConfigModule} from "@nestjs/config"
import { DrizzleModule } from "./database/drizzle.modue"
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        DrizzleModule
    ],
})
export class AppModule {}