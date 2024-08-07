import { userSignup, userLogin } from '../controllers/userController.js';
import { User } from '../models/userModel.js';
import hashPassword from '../utils/hashPassword.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

jest.mock(`${__dirname}/../models/userModel.js`, () => {
  return {
    User: {
      findOne: jest.fn(),
      prototype: {
        save: jest.fn()
      }
    }
  };
});

jest.mock('../utils/hashPassword.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('userController', () => {
  describe('userSignup', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: { name: 'John Doe', email: 'john@example.com', password: 'password123' }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        header: jest.fn()
      };
    });

    it('should return 400 if name, email, or password is missing', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com' };
      await userSignup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'name, email, password are required.' });
    });

    it('should return 409 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'john@example.com' });
      await userSignup(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already registered with this email' });
    });

    it('should return 200 and create a new user if valid data is provided', async () => {
      User.findOne.mockResolvedValue(null);
      hashPassword.mockResolvedValue('hashedPassword');
      const saveMock = jest.fn().mockResolvedValue({});
      User.prototype.save = saveMock;
      User.findOne.mockResolvedValue({ _id: 'userId', email: 'john@example.com' });
      jwt.sign.mockReturnValue('usertoken');

      await userSignup(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.header).toHaveBeenCalledWith('usertoken', 'usertoken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Signup successful', usertoken: 'usertoken' });
    });

    it('should return 500 if an error occurs', async () => {
      User.findOne.mockRejectedValue(new Error('Internal Server Error'));
      await userSignup(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('userLogin', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: { email: 'john@example.com', password: 'password123' }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        header: jest.fn()
      };
    });

    it('should return 400 if email or password is missing', async () => {
      req.body = { email: 'john@example.com' };
      await userLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'email and password are required.' });
    });

    it('should return 401 if user does not exist', async () => {
      User.findOne.mockResolvedValue(null);
      await userLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account does not exist',
        status: false
      });
    });

    it('should return 401 if password is incorrect', async () => {
      User.findOne.mockResolvedValue({ email: 'john@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);
      await userLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password is incorrect' });
    });

    it('should return 200 and a token if login is successful', async () => {
      User.findOne.mockResolvedValue({ _id: 'userId', name: 'John Doe', email: 'john@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('usertoken');

      await userLogin(req, res);

      expect(res.header).toHaveBeenCalledWith('usertoken', 'usertoken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ usertoken: 'usertoken', message: 'Welome John Doe' });
    });

    it('should return 500 if an error occurs', async () => {
      User.findOne.mockRejectedValue(new Error('Internal Server Error'));
      await userLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
