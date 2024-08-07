import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from '../server.js'; // Assuming your Express app is exported from server.js
import { Project } from '../models/projectModel.js';
import { Todo } from '../models/todoModel.js';
import fs from 'fs/promises';
import axios from 'axios';

dotenv.config();

jest.mock('../models/projectModel.js');
jest.mock('../models/todoModel.js');
jest.mock('fs/promises');
jest.mock('axios');

describe('Project Controller', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    token = 'some-auth-token'; // Mocked token for authorization
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('addProject', () => {
    it('should add a new project', async () => {
      Project.findOne.mockResolvedValue(null);
      const saveMock = jest.fn().mockResolvedValue({});
      Project.prototype.save = saveMock;

      const response = await request(app)
        .post('/projects/addproject')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Project', userId: 'userId' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Project added successfully.');
    });

    it('should return 400 if project exists', async () => {
      Project.findOne.mockResolvedValue({});

      const response = await request(app)
        .post('/projects/addproject')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Existing Project', userId: 'userId' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Project with this name already exists');
    });
  });

  describe('getProjects', () => {
    it('should retrieve projects for a user', async () => {
      Project.find.mockResolvedValue([{ title: 'Project 1' }, { title: 'Project 2' }]);

      const response = await request(app)
        .get('/projects/getprojects')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'userId' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Projects retrieved successfully.');
      expect(response.body.projects.length).toBe(2);
    });
  });

  describe('getProjectDetails', () => {
    it('should retrieve project details', async () => {
      Project.findById.mockResolvedValue({ title: 'Project 1' });

      const response = await request(app)
        .get('/projects/getprojectdetails')
        .set('Authorization', `Bearer ${token}`)
        .query({ projectId: 'projectId' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project retrieved successfully.');
    });
  });

  describe('editProject', () => {
    it('should edit a project', async () => {
      Project.findByIdAndUpdate.mockResolvedValue({ title: 'Updated Project' });

      const response = await request(app)
        .patch('/projects/editproject')
        .set('Authorization', `Bearer ${token}`)
        .query({ projectId: 'projectId' })
        .send({ title: 'Updated Project' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Project');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      Project.findByIdAndDelete.mockResolvedValue({ title: 'Deleted Project' });

      const response = await request(app)
        .delete('/projects/deleteproject')
        .set('Authorization', `Bearer ${token}`)
        .query({ projectId: 'projectId' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project deleted successfully');
    });
  });

  describe('createMd', () => {
    it('should create a markdown file and return a gist URL', async () => {
      Project.findById.mockResolvedValue({ title: 'Project 1' });
      Todo.find.mockResolvedValue([
        { description: 'Todo 1', status: 'pending' },
        { description: 'Todo 2', status: 'done' }
      ]);
      const writeFileMock = jest.fn().mockResolvedValue(undefined);
      fs.writeFile = writeFileMock;
      axios.post.mockResolvedValue({ data: { html_url: 'https://gist.github.com/some-gist-url' } });

      const response = await request(app)
        .get('/projects/createmd')
        .set('Authorization', `Bearer ${token}`)
        .query({ projectId: 'projectId' });

      expect(response.status).toBe(200);
      expect(response.body.url).toBe('https://gist.github.com/some-gist-url');
    });
  });
});
