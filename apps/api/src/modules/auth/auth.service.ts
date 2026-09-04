import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: true } } }
    });
    if (!user || !user.passwordHash || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const roles = user.userRoles.map((item) => item.role.name);
    const payload = { sub: user.id, email: user.email, roles };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_SECONDS ?? 900)
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_SECONDS ?? 604800)
    });
    const refreshTokenHash = await bcrypt.hash(refreshToken, Number(process.env.BCRYPT_ROUNDS ?? 12));
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash, lastLoginAt: new Date() } });
    await this.prisma.auditLog.create({
      data: { userId: user.id, action: 'USER_LOGIN', entity: 'user', entityId: user.id, result: 'SUCCESS' }
    });
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, roles } };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwt.verifyAsync<{ sub: string; email: string; roles: string[] }>(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET
    });
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const accessToken = await this.jwt.signAsync(
      { sub: payload.sub, email: payload.email, roles: payload.roles },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_SECONDS ?? 900)}
    );
    return { accessToken };
  }
}
