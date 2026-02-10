// src/modules/favorite/favorite.module.ts
import { Module } from "@nestjs/common";
import { FavoriteController } from "./favorite.controller";
import { FavoriteService } from "./favorite.service";
import { DrizzleService } from "@/database/drizzle.service";

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}