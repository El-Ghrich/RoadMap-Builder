import { UserController } from '../user.controller';
import { Request, Response } from 'express';

describe('UserController Unit Tests', () => {
  let userController: UserController;
  let mockUserService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;
  let cookieSpy: jest.Mock;

  beforeEach(() => {
    mockUserService = {
      signUp: jest.fn(),
      login: jest.fn()
    };

    userController = new UserController(mockUserService);

    statusSpy = jest.fn().mockReturnThis();
    jsonSpy = jest.fn().mockReturnThis();
    cookieSpy = jest.fn().mockReturnThis();

    mockResponse = {
      status: statusSpy,
      json: jsonSpy,
      cookie: cookieSpy
    };
  });

  describe('signUp', () => {
    it('should return 201 when signup success', async () => {
      mockRequest = {
        body: {
          username: 'said',
          email: 'said@gmail.com',
          password: '123'
        }
      };

      const user = {
        id: '1',
        username: 'said',
        email: 'said@gmail.com'
      };

      mockUserService.signUp.mockResolvedValue(user);

      await userController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'User created successfully',
        data: user
      });
    });

    it('should return 409 when signup fails', async () => {
      mockRequest = {
        body: {
          username: 'said',
          email: 'said@gmail.com',
          password: '123'
        }
      };

      mockUserService.signUp.mockRejectedValue(
        new Error('email is already exist')
      );

      await userController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(409);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: 'error',
        message: 'email is already exist'
      });
    });
  });

/*   describe('login', () => {
    it('should set accessToken and refreshToken when rememberMe is true', async () => {
      mockRequest = {
        body: {
          email: 'said@gmail.com',
          password: '123',
          rememberMe: true
        }
      };

      mockUserService.login.mockResolvedValue({
        user: { id: '1', username: 'said' },
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
      });

      await userController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(cookieSpy).toHaveBeenCalledWith(
        'accessToken',
        'access_token',
        expect.any(Object)
      );
      expect(cookieSpy).toHaveBeenCalledWith(
        'refreshToken',
        'refresh_token',
        expect.any(Object)
      );
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Login successful',
        user: { id: '1', username: 'said' }
      });
    });

    it('should set only accessToken when rememberMe is false', async () => {
      mockRequest = {
        body: {
          email: 'said@gmail.com',
          password: '123',
          rememberMe: false
        }
      };

      mockUserService.login.mockResolvedValue({
        user: { id: '1', username: 'said' },
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
      });

      await userController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(cookieSpy).toHaveBeenCalledWith(
        'accessToken',
        'access_token',
        expect.any(Object)
      );
      expect(cookieSpy).not.toHaveBeenCalledWith(
        'refreshToken',
        expect.anything(),
        expect.anything()
      );
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Login successful',
        user: { id: '1', username: 'said' }
      });
    });
  }); */
});
