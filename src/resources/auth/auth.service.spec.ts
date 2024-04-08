import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup-dto';
import { AuthResultDto } from './dto/auth-result.dto';
import * as bcrypt from 'bcrypt';

class UsersServiceMock {
  async findOne(query): Promise<any> {
    if (query.email === 'test@example.com') {
      return {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'user',
      };
    }
    return null;
  }

  async create(createUserDto): Promise<any> {
    return {
      id: 2,
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };
  }

  async checkIfUserExists(query): Promise<boolean> {
    return query.email === 'test@example.com';
  }
}

class JwtServiceMock {
  async signAsync(payload): Promise<string> {
    return 'mocked.jwt.token';
  }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: JwtService, useClass: JwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signin', () => {
    it('should sign in successfully', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result: AuthResultDto = await service.signIn(signinDto);
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toEqual(signinDto.email);
      expect(result.access_token).toEqual('mocked.jwt.token');
    });

    it('should throw unauthorized error for incorrect password', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      try {
        await service.signIn(signinDto);
      } catch (error) {
        expect(error.statusCode).toEqual(401);
        expect(error.error).toEqual('Unauthorized');
      }
    });

    it('should throw unauthorized error for non-existing user', async () => {
      const signinDto: SigninDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };
      try {
        await service.signIn(signinDto);
      } catch (error) {
        expect(error.statusCode).toEqual(401);
        expect(error.error).toEqual('Unauthorized');
      }
    });
  });

  describe('signup', () => {
    it('should sign up successfully', async () => {
      const signupDto: SignupDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password',
      };
      const result: AuthResultDto = await service.signup(signupDto);
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toEqual(signupDto.email);
      expect(result.access_token).toEqual('mocked.jwt.token');
    });

    it('should throw error for existing email during signup', async () => {
      const signupDto: SignupDto = {
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password',
      };
      try {
        await service.signup(signupDto);
      } catch (error) {
        expect(error.statusCode).toEqual(400);
        expect(error.error).toEqual('Bad Request');
        expect(error.message[0]).toEqual('User already exists');
      }
    });
  });
});
