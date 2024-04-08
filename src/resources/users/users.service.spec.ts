import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from './types';

class UsersRepositoryMock {
  private users: User[] = [];

  async save(userDto: CreateUserDto): Promise<User> {
    const user: User = {
      id: Math.random(),
      role: Role.User,
      ...userDto,
    };
    this.users.push(user);
    return user;
  }

  async findOneBy(filter): Promise<User | null> {
    return this.users.find((user) => user.email === filter.email) || null;
  }
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useClass: UsersRepositoryMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };
      const createdUser = await service.create(createUserDto);
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.name).toEqual(createUserDto.name);
      expect(createdUser.email).toEqual(createUserDto.email);
      expect(createdUser.role).toEqual(Role.User);
    });
  });

  describe('findOne', () => {
    it('should find an existing user by email', async () => {
      const existingEmail = 'existing@example.com';
      const createUserDto: CreateUserDto = {
        name: 'Existing User',
        email: existingEmail,
        password: 'password',
      };
      await service.create(createUserDto);
      const foundUser = await service.findOne({ email: existingEmail });
      expect(foundUser).toBeDefined();
      expect(foundUser.email).toEqual(existingEmail);
      expect(foundUser.name).toEqual(createUserDto.name);
      expect(foundUser.role).toEqual(Role.User);
    });

    it('should return null if user does not exist', async () => {
      const nonexistentEmail = 'nonexistent@example.com';
      const foundUser = await service.findOne({ email: nonexistentEmail });
      expect(foundUser).toBeNull();
    });
  });
});
