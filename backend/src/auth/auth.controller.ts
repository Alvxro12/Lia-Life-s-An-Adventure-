import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { User } from './decorator/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        // llama al método del service
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
    
    @UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@User() user: any) {
    return {
        message: `Hola ${user.email}, tu ID es ${user.id}`,
    };
}
}
