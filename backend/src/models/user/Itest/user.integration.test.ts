import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/dbConfig';

describe('User Integration Tests', () => {
    let resetToken: string;
    let userId: string;

    beforeAll(async () => {
        await AppDataSource.connect();
    });

    afterAll(async () => {
        const dataSource = AppDataSource.getDataSource();
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    describe('POST /api/auth/signup', () => {
        it('should register a new user and return 201', async () => {
            const signupPayload = {
                username: 'said_test_' + Date.now(),
                email: 'said_' + Date.now() + '@gmail.com',
                password: 'password123',
                firstName: 'said',
                lastName: 'nichan',
                age: 21
            };

            const response = await request(app)
                .post('/api/auth/signup')
                .send(signupPayload);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(signupPayload.email);
        });

        it('should return 409 if email is already taken', async () => {
            const email = 'collision_' + Date.now() + '@test.com';
            const payload = {
                username: 'user_' + Date.now(),
                email: email,
                password: 'password123',
                firstName: 'First',
                lastName: 'Last',
                age: 21
            };
            await request(app).post('/api/auth/signup').send(payload);

            const response = await request(app)
                .post('/api/auth/signup')
                .send({ ...payload, username: 'other_' + Date.now() });

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/auth/login', () => {
        const userCredentials = {
            email: 'login_' + Date.now() + '@test.com',
            password: 'correct_password'
        };

        beforeAll(async () => {
            await request(app).post('/api/auth/signup').send({
                username: 'login_user_' + Date.now(),
                email: userCredentials.email,
                password: userCredentials.password,
                firstName: 'Login',
                lastName: 'User',
                age: 21
            });
        });

        it('should login successfully and set cookies', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ ...userCredentials, rememberMe: true });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            const cookies = response.get('Set-Cookie');
            expect(cookies?.some(c => c.includes('accessToken'))).toBe(true);
            expect(cookies?.some(c => c.includes('refreshToken'))).toBe(true);
        });
    });

    describe('GET /api/auth/profil', () => {
        let authCookie: string;

        beforeAll(async () => {
            const email = 'profil_' + Date.now() + '@test.com';
            await request(app).post('/api/auth/signup').send({
                username: 'profil_user_' + Date.now(),
                email: email,
                password: 'password123',
                firstName: 'Profil',
                lastName: 'User',
                age: 25
            });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email, password: 'password123' });

            const rawCookie = loginRes.get('Set-Cookie')!.find(c => c.startsWith('accessToken='))!;
            authCookie = rawCookie.split(';')[0];
        });

        it('should return user profile when authenticated', async () => {
            const response = await request(app)
                .get('/api/auth/profil')
                .set('Cookie', [authCookie]);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('username');
        });
    });

    describe('Forgot & Reset Password', () => {
        const email = 'forgot_' + Date.now() + '@test.com';

        beforeAll(async () => {
            await request(app).post('/api/auth/signup').send({
                username: 'forgot_user_' + Date.now(),
                email: email,
                password: 'password123',
                firstName: 'Forgot',
                lastName: 'User',
                age: 21
            });
        });

        it('should request password reset successfully', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            resetToken = response.body.data.resetToken;
            userId = response.body.data.userId;

            expect(resetToken).toBeDefined();
            expect(userId).toBeDefined();
        });

        it('should reset password with valid token', async () => {
            const response = await request(app)
                .post(`/api/auth/reset-password/${userId}/${resetToken}`)
                .send({ password: 'NewStrongPassword123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password change successful');
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .post(`/api/auth/reset-password/${userId}/invalid-token`)
                .send({ password: 'NewStrongPassword123' });

            expect(response.status).toBe(401);
        });
    });

describe('POST /api/auth/logout', () => {
    it('should clear cookies and return success', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', [
                'accessToken=dummyAccessToken;',
                'refreshToken=dummyRefreshToken;'
            ]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logout successful');
    });
});


});
