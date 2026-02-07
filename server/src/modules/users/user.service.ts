import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { ConfigService } from "@nestjs/config";
import { roleTable, userTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

export interface User {
  id_user: number;
  username: string;
  password: string;
  salt: string;
  role: string;
}
@Injectable()
export class UserService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private configService: ConfigService,
  ) {}

  private get db() {
    return this.drizzleService.db;
  }
  async createUser(username: string, password: string, role: string) {
    try {
      //      const checkUser = this.db
      //     .select({
      //       username: userTable.username,
      //     })
      //     .from(userTable)
      //     .where(eq(userTable.username, username));

      //   if (checkUser) {
      //     throw new BadRequestException(
      //       "Такой пользователь уже зарегестрирован!",
      //     );
      // }
      const salt = crypto.randomBytes(16).toString("hex");
      const pass = crypto
        .pbkdf2Sync(password, salt, 1000, 32, "sha512")
        .toString("hex");
      await this.db.insert(userTable).values({
        username,
        password: pass,
        salt: salt,
        idRole: role === "Пользователь" ? 1 : 2,
      });
      return { success: true, msg: "Учётная запись создана" };
    } catch (error) {}
  }

  async signUp(username: string, password: string, role: string) {
    try {
      const user = await this.getUserInfo(username);

      if (user) {
        throw new BadRequestException(
          "Такой пользователь уже зарегестрирован!",
        );
      }
      const isMatch = this.isMatchPassword(password, user.password, user.salt);
      if (!isMatch) {
        throw new UnauthorizedException(
          "Неккоректное имя пользователя или пароль",
        );
      }
      const payload = {
        displayname: user.username,
        role: user.role,
        id_user: user.id_user,
      };
      const secret = this.configService.get("TOKEN_SECRET") || "12345";
      const authToken = jwt.sign(payload, secret, { expiresIn: "24h" });

      const { password: _, salt: __, ...safeUser } = user;

      await this.createUser(username, password, role);

      return {
        success: true,
        msg: "Токен пользователя",
        authToken,
        user: safeUser,
      };
    } catch (err) {}
  }

  async signIn(username: string, password: string) {
    try {
      const user = await this.getUserInfo(username);
      if (!user) {
        throw new NotFoundException("Такой пользователь не найден!");
      }
      const isMatch = this.isMatchPassword(password, user.password, user.salt);
      if (!isMatch) {
        throw new UnauthorizedException(
          "Неккоректное имя пользователя или пароль",
        );
      }

      const payload = {
        displayname: user.username,
        role: user.role,
        id_user: user.id_user,
      };
      const secret = this.configService.get("TOKEN_SECRET") || "12345";
      const authToken = jwt.sign(payload, secret, { expiresIn: "24h" });

      const { password: _, salt: __, ...safeUser } = user;

      return {
        success: true,
        msg: "Токен пользователя",
        authToken,
        user: safeUser,
      };
    } catch {}
  }
  async updatePassword(
    username: string,
    password: string,
    newPassword: string,
  ) {
    try {
      const user = await this.getUserInfo(username);
      // const user = this.db
      // .select({
      //     id_user: userTable.idUser,
      //     username: userTable.username,
      //     password: userTable.password,
      //     salt: userTable.salt
      // })
      // .from(userTable)
      // .where(eq(userTable.idUser, idUser))
      // .limit(1);
      // if (!user) return responseHandler.notauthorized(res);

      if (this.isMatchPassword(password, user.password, user.salt)) {
        throw new BadRequestException("Неверный пароль!");
      }
      const newSalt = crypto
        .pbkdf2Sync(
          newPassword,
          crypto.randomBytes(8).toString("hex"),
          1000,
          32,
          "sha512",
        )
        .toString("hex");

      await this.db
        .update(userTable)
        .set({
          password: newPassword,
          salt: newSalt,
        })
        .where(eq(userTable.username, username));
      return { success: true, msg: "Пароль обновлён" };
    } catch {}
  }

  private async getUserInfo(username: string) {
    const result = await this.db
      .select({
        id_user: userTable.idUser,
        username: userTable.username,
        password: userTable.password,
        salt: userTable.salt,
        role: roleTable.nameRole,
      })
      .from(userTable)
      .leftJoin(roleTable, eq(userTable.idRole, roleTable.idRole))
      .where(eq(userTable.username, username))
      .limit(1);

    return result[0] ?? null;
  }
  private isMatchPassword(
    pasword: string,
    storedHash: string,
    salt: string,
  ): boolean {
    const hash = crypto
      .pbkdf2Sync(pasword, salt, 1000, 32, "sha512")
      .toString("hex");
    return hash === storedHash;
  }
}

// module.exports = { signUp, signIn, updatePassword, getInfo };
