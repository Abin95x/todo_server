// test/routes/userRoutes.test.js

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import userRouter from '../routes/userRoute.js';
import { User } from '../models/userModel.js';
import hashPassword from '../utils/hashPassword.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

jest.mock('../models/userModel.js');
jest.mock('../utils/hashPassword.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use('/users', userRouter);

describe('User Routes', () => {
  describe('POST /signup', () => {
    it('should return 400 if name, email, or password is missing', async () => {
      const response = await request(app)
        .post('/users/signup')
        .send({ name: 'John Doe', email: 'john@example.com' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('name, email, password are required.');
    });

    it('should return 409 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'john@example.com' });
      const response = await request(app)
        .post('/users/signup')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
      expect(response.status).toBe(409);
      expect(response.body.message).toBe('User already registered with this email');
    });

    it('should return 200 and create a new user if valid data is provided', async () => {
      // Mock implementations
      User.findOne.mockResolvedValue(null); // No user found
      hashPassword.mockResolvedValue('hashedPassword'); // Mock hashed password
      const saveMock = jest.fn().mockResolvedValue({}); // Mock save function
      User.prototype.save = saveMock; // Use mock save function
      User.findOne.mockResolvedValue({ _id: 'userId', email: 'john@example.com' }); // User exists
      jwt.sign.mockReturnValue('usertoken'); // Mock JWT token
  
      const response = await request(app)
        .post('/users/signup')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Signup successful');
      expect(response.body.usertoken).toBe('usertoken');
      expect(User.prototype.save).toHaveBeenCalled(); // Ensure save was called
    });
  
    it('should return 409 if user already exists', async () => {
      // Mock implementations
      User.findOne.mockResolvedValue({ _id: 'userId', email: 'john@example.com' }); // User exists
  
      const response = await request(app)
        .post('/users/signup')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
  
      expect(response.status).toBe(409);
      expect(response.body.message).toBe('User already registered with this email');
    });

    it('should return 500 if an error occurs', async () => {
      User.findOne.mockRejectedValue(new Error('Internal Server Error'));
      const response = await request(app)
        .post('/users/signup')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('POST /login', () => {
    it('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ email: 'john@example.com' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('email and password are required.');
    });

    it('should return 401 if user does not exist', async () => {
      User.findOne.mockResolvedValue(null);
      const response = await request(app)
        .post('/users/login')
        .send({ email: 'john@example.com', password: 'password123' });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Account does not exist');
    });

    it('should return 401 if password is incorrect', async () => {
      User.findOne.mockResolvedValue({ email: 'john@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);
      const response = await request(app)
        .post('/users/login')
        .send({ email: 'john@example.com', password: 'password123' });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Password is incorrect');
    });

    it('should return 200 and a token if login is successful', async () => {
      User.findOne.mockResolvedValue({ _id: 'userId', name: 'John Doe', email: 'john@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('usertoken');

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'john@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.usertoken).toBe('usertoken');
      expect(response.body.message).toBe('Welome John Doe');
    });

    it('should return 500 if an error occurs', async () => {
      User.findOne.mockRejectedValue(new Error('Internal Server Error'));
      const response = await request(app)
        .post('/users/login')
        .send({ email: 'john@example.com', password: 'password123' });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });
});
