import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUser } from './admin-user.entity';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdminUser) private readonly adminUsers: Repository<AdminUser>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.adminUsers.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { token };
  }
}
