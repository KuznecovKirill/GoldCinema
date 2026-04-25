import { CanActivate, createParamDecorator, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

//Файл для проверки авторизированных пользователей

import { ConfigService } from "@nestjs/config";

const checkClockTime = (expireTime: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime >= expireTime) return true;
  return false
};

@Injectable()
export class CheckToken implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header("Authorization")?.split(" ")[1];
    if (!authHeader){
      throw new UnauthorizedException("Нет токена, авторизация отклонена");
    }
    try {
       // Вместо jose.decodeJwt используем jwt.decode
      const decodedToken = jwt.decode(authHeader) as any;
      if (!decodedToken) {
        throw new UnauthorizedException("Некорректный токен");
      }

      // Проверка срока действия токена
      if (decodedToken.exp && checkClockTime(decodedToken.exp)) {
        throw new ForbiddenException("Истёк срок жизни токена");
      }
      
      //const token = authHeader.split(" ")[1];
      const jwtToken = this.configService.get("TOKEN_SECRET") || "12345";
      const decoded = jwt.verify(authHeader, jwtToken);
      console.log(decoded)
      if (decoded) {
        request.user = decoded;
        return true;
      }
      return false;
    } catch (err: any) {
      console.log(err);
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
