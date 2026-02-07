import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import mysql, { Pool } from "mysql2/promise";
import {drizzle, type MySql2Database} from "drizzle-orm/mysql2";
import * as schema from "./schema";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    public db: MySql2Database<typeof schema>;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        this.pool = await mysql.createPool({
            host: this.configService.get<string>("DB_HOST", "MySQL-8.0"),
            port: this.configService.get<number>("DB_PORT", 3306),
            user: this.configService.get<string>("DB_USER", "root"),
            password: this.configService.get<string>("DB_PASSWORD", ""),
            database: this.configService.get<string>("DB_DATABASE", "Gold_Cinema"),
        });

        this.db = drizzle(this.pool, {schema, mode: "default"});

        await this.pool.query("SELECT 1");
        console.log("Database connected successfully");
    }

    async onModuleDestroy() {
        await this.pool?.end();
        console.log("Database connection closed");
    }
}