import { DrizzleService } from "@/database/drizzle.service";
import { HttpServer, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MultimodalService {
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpServer,
    private readonly configService: ConfigService,
    private readonly drizzleService: DrizzleService,
  ) {
    this.apiUrl = this.configService.get("OLLAMA_URL");
  }

  private get db() {
    return this.drizzleService.db;
  }
}
