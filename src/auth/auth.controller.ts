import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, ProfileUpdateDto, RefreshDto, RegisterDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from '../common/admin.guard';
import { User } from '../entities/user.entity';
import { serializeUser } from '../orders/order.serializer';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register/')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login/')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('token/refresh/')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refresh);
  }

  @Get('livreurs/')
  @UseGuards(JwtAuthGuard)
  listLivreurs() {
    return this.auth.listLivreurs();
  }

  @Get('clients/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  listClients() {
    return this.auth.listClients();
  }

  @Get('profile/')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: { user: User }) {
    return serializeUser(req.user);
  }

  @Patch('profile/')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Req() req: { user: User }, @Body() dto: ProfileUpdateDto) {
    return this.auth.updateProfile(req.user, dto);
  }
}
