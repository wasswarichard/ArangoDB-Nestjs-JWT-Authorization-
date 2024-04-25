import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Auth } from './entities/auth.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({ description: 'logged in successfully', type: Auth })
  validateUser(@Body() createAuthDto: CreateAuthDto): Promise<Auth> {
    return this.authService.login(createAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Get user profile', type: Auth })
  @Get('/profile')
  getUserProfile(@Request() req): Promise<Auth> {
    return this.authService.userProfile(req);
  }
}
