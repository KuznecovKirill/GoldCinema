import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as jose from "jose";

//Файл для проверки авторизированных пользователей

import { modelUser } from "../models/modelUser";
import responseHandler from "../handlers/response.handler";
import { ConfigService } from "@nestjs/config";

const checkClockTime = (expireTime: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime >= expireTime) return true;
  return false
};

@Injectable()
export class CheckToken implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header("authorization")?.split(" ")[1];
    if (!authHeader){
      throw new UnauthorizedException("Нет токена, авторизация отклонена");
    }
    try {
      const {exp} = jose.decodeJwt(authHeader);
      if (checkClockTime(exp)) throw new ForbiddenException("Истёк срок жизни токена");
      
      const token = authHeader.split(" ")[1];
        const jwtToken = this.configService.get("TOKEN_SECRET");
        const decoded = jwt.verify(token, jwtToken);
      request.user = (decoded as any).user;
      return true;
    } catch (err: any) {
      if (err.name === "JsonWebTokenError"){
        throw new UnauthorizedException("Неккоректный токен. Повторно авторизуйтесь в системе.");
      }
      throw new UnauthorizedException("Ошибка авторизации");
    }
  }
}

@Injectable()
export class CheckUser implements CanActivate {
  canActivate(context: ExecutionContext): boolean{
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user){
      throw new UnauthorizedException("Пользователь не авторизован!")
    }

    return true;
  }
}

@Injectable()
export class CheckAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean{
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (user.role !== "Администратор"){
      throw new UnauthorizedException("Пользователь не авторизован!")
    }
    return true;
  }
}

// const user = async (req, res, next) => {
//   const token = decode(req);
//   if (!token) {
//     console.log("нет токена!");
//     return responseHandler.notauthorized(res);
//   }

//   const userID = await modelUser.findByPk(token.data); //Извлечение id

//   if (!userID) return responseHandler.notauthorized(res); //

//   req.user = userID;

//   next();
// };

// const decode = (req) => {
//     try {
//       const bearerHeader = req.headers["authorization"];

//       if (bearerHeader) {
//         const token = bearerHeader.split(" ")[1];

//         return jsonwebtoken.verify(
//           token,
//           process.env.TOKEN_SECRET
//         );
//       }

//       return false;
//     } catch {
//       return false;
//     }
//   };

// module.exports = {user, decode};
