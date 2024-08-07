import mongoose from 'mongoose';
import { User } from '../models/userModel.js';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a user successfully', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('John Doe');
    expect(savedUser.email).toBe('john@example.com');
    expect(savedUser.password).toBe('password123');
  });

  it('should not create a user without a name', async () => {
    const user = new User({
      email: 'john@example.com',
      password: 'password123'
    });

    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  it('should not create a user without an email', async () => {
    const user = new User({
      name: 'John Doe',
      password: 'password123'
    });

    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should not create a user without a password', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com'
    });

    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });
});
