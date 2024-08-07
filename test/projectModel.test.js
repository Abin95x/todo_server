import mongoose from 'mongoose';
import { Project } from '../models/projectModel.js';
import { User } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Project Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a project successfully', async () => {
    const user = new User({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
    await user.save();

    const validProject = new Project({
      title: 'Project 1',
      userId: user._id,
    });

    const savedProject = await validProject.save();

    expect(savedProject._id).toBeDefined();
    expect(savedProject.title).toBe('Project 1');
    expect(savedProject.userId).toBe(user._id);
  });

  it('should not create a project without required fields', async () => {
    const projectWithoutRequiredField = new Project({});

    let err;
    try {
      await projectWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
    expect(err.errors.userId).toBeDefined();
  });

  it('should populate the userId with the referenced User document', async () => {
    const user = new User({ name: 'Jane Doe', email: 'jane@example.com', password: 'password123' });
    await user.save();

    const project = new Project({
      title: 'Project 2',
      userId: user._id,
    });
    await project.save();

    const foundProject = await Project.findById(project._id).populate('userId');
    expect(foundProject.userId.name).toBe('Jane Doe');
    expect(foundProject.userId.email).toBe('jane@example.com');
  });
});
