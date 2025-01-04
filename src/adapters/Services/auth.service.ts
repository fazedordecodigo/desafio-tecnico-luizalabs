import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY } from '../constants';
import { SignInAuthDto } from 'src/ports/Application/dto/signin-auth.dto';
import { UsersRepositoryProtocol } from 'src/ports/Application/Protocols/users.repository.protocol';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly _repository: UsersRepositoryProtocol,
    private readonly jwtService: JwtService
) {}

  async signIn(signin: SignInAuthDto): Promise<any> {
    const result = await this._repository.getByEmail(signin.email);
    if (!result) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(signin.password, result.password);
    if (isMatch) {
      const payload = { sub: result.email, role: result.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException();
  }
}
