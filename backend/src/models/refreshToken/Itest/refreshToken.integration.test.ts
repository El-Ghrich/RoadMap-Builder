import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/dbConfig';


describe('RefreshToken Integration Tests', () => {

    beforeAll(async () => {
        const dataSource = AppDataSource.getDataSource();
            if (!dataSource.isInitialized) {
                await dataSource.initialize();
            }
    });

    afterAll(async () => {
        const dataSource = AppDataSource.getDataSource();
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    it('should refresh tokens using valid cookie', async () => {

          await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'refresh_tester',
                email: 'refresh@test.com',
                password: 'password123'
            });


        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'refresh@test.com',
                password: 'password123',
                rememberMe: true
            });

        const cookies = loginResponse.get('Set-Cookie');
        const refreshTokenCookie = cookies?.find(c => c.startsWith('refreshToken='));
        expect(refreshTokenCookie).toBeDefined();

        const response = await request(app)
            .post('/api/auth/refresh')
            .set('Cookie', [refreshTokenCookie!]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Refresh réussi");

        const newCookies = response.get('Set-Cookie');
        expect(newCookies?.some(c => c.startsWith('accessToken='))).toBe(true);
        expect(newCookies?.some(c => c.startsWith('refreshToken='))).toBe(true);
    });

    it('should fail to refresh with missing cookie', async () => {
        const response = await request(app).post('/api/auth/refresh');
        expect(response.status).toBe(401);
    });

    it('should fail to refresh with invalid token', async () => {
        const response = await request(app)
            .post('/api/auth/refresh')
            .set('Cookie', ['refreshToken=invalid_token']);

        expect(response.status).toBe(403);
    });
});
