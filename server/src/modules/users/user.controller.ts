import { Body, Controller, Get, HttpCode, Post, Put, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User, UserService } from "./user.service";
import { CheckToken } from "@/middlewares/middleware";
import z from "zod"
import {createZodDto} from "nestjs-zod"
import { UserDecorator } from "@/decorators/user.decorator";
const SignInSchema = z.object({
     username: z.string().min(1),
    password: z.string().min(8),
})

const SignUpSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(8),
    role: z.string().min(1),
    confirmPassword: z.string().min(8)
})

const UpdatePasswordSchema = z.object({
    password: z.string().min(8),
    newPassword: z.string().min(8),
})

export class SignIn extends createZodDto(SignInSchema) {}
export class SignUp extends createZodDto(SignUpSchema) {}
export class UpdatePassword extends createZodDto(UpdatePasswordSchema) {}

@ApiTags("USERS")
@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Post("signUp")
    @HttpCode(200)
    @ApiBearerAuth()
    @ApiOperation({summary: "Регистрация пользователя"})
    @ApiBody({ type: SignUp })
    async signUp(@Body(ValidationPipe) signUpDto: SignUp) {
        return await this.userService.signUp(
            signUpDto.username, 
            signUpDto.password, 
            signUpDto.role
        );
    }

    @Post("signIn")
    @ApiOperation({summary: "Вход пользователя"})
    @ApiBody({ type: SignIn })
    async signIn(@Body(ValidationPipe) signInDto: SignIn) {
        return await this.userService.signIn(
            signInDto.username, 
            signInDto.password
        );
    }

     @Put("update-password")
    @ApiBearerAuth()
    @UseGuards(CheckToken)
    @ApiOperation({summary: "Изменение пароля"})
    @ApiBody({ type: UpdatePassword })
    async updatePassword(
        @UserDecorator() user: User,
        @Body(ValidationPipe) updatePasswordDto: UpdatePassword
    ) {
        return await this.userService.updatePassword(
            user.username,
            updatePasswordDto.password,
            updatePasswordDto.newPassword
        );
    }

    @Get("info")
    @ApiBearerAuth()
    @UseGuards(CheckToken)
    @ApiOperation({summary: "Получить данные пользователя"})
    async getInfo(@UserDecorator() user: User) {
        return await this.userService.getUserInfo(user.username);
    }
}