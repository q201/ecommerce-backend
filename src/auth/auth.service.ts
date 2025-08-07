import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Auth; access_token: string }> {
    const { email, password, role } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.authRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.authRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    
    const savedUser = await this.authRepository.save(user);
    
    const payload = { email: savedUser.email, sub: savedUser.id, role: savedUser.role };
    const access_token = this.jwtService.sign(payload);
    
    return {
      user: savedUser,
      access_token,
    };
  }

  async validateUser(email: string, password: string): Promise<Auth | null> {
    const user = await this.authRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ user: Auth; access_token: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    
    return {
      user,
      access_token,
    };
  }

  async findById(id: string): Promise<Auth> {
    const user = await this.authRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
