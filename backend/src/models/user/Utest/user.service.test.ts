import { UserService } from '../user.service';
import { IUserRepository } from '../interface/user.interface';
import { LoginRequestDto, UserRequestDto } from '../user.dto';
import * as HashUtils from '../../../utils/HashPassword';

describe('UserService Unit Tests', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockTokenService: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
      findById: jest.fn()
    } as any;

    mockTokenService = {
      createFullSession: jest.fn().mockResolvedValue({
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
      }),
      createAccessTokenOnly: jest.fn().mockReturnValue('access_token')
    };

    userService = new UserService(mockUserRepository, mockTokenService);
    process.env.JWT_ACCESS_SECRET = 'test_access_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
  });

  describe('signUp', () => {
    it('should successfully create a user when data is valid', async () => {
      const signupDto: UserRequestDto = {
        username: 'said',
        email: 'said@gmail.com',
        password: 'password123'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue({
        id: '111',
        ...signupDto,
        password: 'hashed',
        createdAt: new Date()
      } as any);

      const result = await userService.signUp(signupDto);

      expect(result.email).toBe(signupDto.email);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if email exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: '1' } as any);

      await expect(
        userService.signUp({
          username: 'said',
          email: 'said@gmail.com',
          password: '123'
        })
      ).rejects.toThrow('email is already exist');
    });

    it('should throw error if username exists', async () => {
      mockUserRepository.findByUsername.mockResolvedValue({ id: '1' } as any);

      await expect(
        userService.signUp({
          username: 'said',
          email: 'said@gmail.com',
          password: '123'
        })
      ).rejects.toThrow('username is already exist');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginDto: LoginRequestDto = {
        email: 'said@gmail.com',
        password: 'password123'
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'said@gmail.com',
        password: 'hashed'
      } as any);

      jest.spyOn(HashUtils, 'MatchingPassword').mockResolvedValue(true);

      const result = await userService.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(loginDto.email);
    });

    it('should throw error if email invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        userService.login({ email: 'x', password: 'x' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'said@gmail.com',
        password: 'hashed'
      } as any);

      jest.spyOn(HashUtils, 'MatchingPassword').mockResolvedValue(false);

      await expect(
        userService.login({ email: 'said@gmail.com', password: 'x' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfil', () => {
    it('should return user profile if found', async () => {
      const mockUser = {
        id: '1',
        username: 'said',
        email: 'said@gmail.com',
        firstName: 'said',
        lastName: 'nichan'
      };

      mockUserRepository.findById.mockResolvedValue(mockUser as any);

      const result = await userService.getProfil('1');

      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('said');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getProfil('999')).rejects.toThrow('User not found');
    });
  });
});
