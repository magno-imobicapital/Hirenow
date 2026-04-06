import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/generated';

interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async generate(payload: TokenPayload) {
    return { acessToken: this.jwt.sign<TokenPayload>(payload) };
  }
}
