import { DrizzleService } from "@/database/drizzle.service";
import { HttpServer, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

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

  //Компьютерное зрение
  async askImage(image: string, prompt: string): Promise<string> {
    try {
      const base64Data = image.includes("base64,")
        ? image.split(",")[1]
        : image;

      const payload = {
        model: "qwen2:7b", //Qwen2 - мультимодальный
        prompt: prompt,
        images: [base64Data],
        stream: false,
      };
      const response = await axios.post<{ response: string }>(
        `${this.apiUrl}/api/generate`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      return response.data.response;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
}
