import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRouter from '../routes/todoRoutes.js';
import { Todo } from '../models/todoModel.js';

dotenv.config();

jest.mock('../models/todoModel.js');

const app = express();
app.use(express.json());
app.use('/todos', todoRouter);

describe('Todo Routes', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    token = 'some-auth-token'; // Mocked token for authorization
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /todos/addtodo', () => {
    it('should add a new todo', async () => {
      Todo.findOne.mockResolvedValue(null);
      const saveMock = jest.fn().mockResolvedValue({});
      Todo.prototype.save = saveMock;

      const response = await request(app)
        .post('/todos/addtodo')
        .set('Authorization', `Bearer ${token}`)
        .send({ task: 'New Task', description: 'New Description', userId: 'userId', projectId: 'projectId' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Todo added successfully.');
    });

    it('should return 409 if todo exists', async () => {
      Todo.findOne.mockResolvedValue({});

      const response = await request(app)
        .post('/todos/addtodo')
        .set('Authorization', `Bearer ${token}`)
        .send({ task: 'Existing Task', description: 'Existing Description', userId: 'userId', projectId: 'projectId' });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('A todo with already exists for this user and project.');
    });
  });

  describe('GET /todos/gettodos', () => {
    it('should retrieve todos for a project', async () => {
      Todo.find.mockResolvedValue([{ task: 'Task 1' }, { task: 'Task 2' }]);

      const response = await request(app)
        .get('/todos/gettodos')
        .set('Authorization', `Bearer ${token}`)
        .query({ projectId: 'projectId' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Todo added successfully.');
      expect(response.body.todo.length).toBe(2);
    });
  });

  describe('PATCH /todos/marktodo', () => {
    it('should mark a todo as done', async () => {
      const mockTodo = { status: 'pending', save: jest.fn().mockResolvedValue({ status: 'done' }) };
      Todo.findById.mockResolvedValue(mockTodo);

      const response = await request(app)
        .patch('/todos/marktodo')
        .set('Authorization', `Bearer ${token}`)
        .query({ todoId: 'todoId' });

      expect(response.status).toBe(200);
      expect(response.body.todo.status).toBe('done');
    });

    it('should mark a todo as pending', async () => {
      const mockTodo = { status: 'done', save: jest.fn().mockResolvedValue({ status: 'pending' }) };
      Todo.findById.mockResolvedValue(mockTodo);

      const response = await request(app)
        .patch('/todos/marktodo')
        .set('Authorization', `Bearer ${token}`)
        .query({ todoId: 'todoId' });

      expect(response.status).toBe(200);
      expect(response.body.todo.status).toBe('pending');
    });
  });

  describe('PATCH /todos/updatetodo', () => {
    it('should update a todo', async () => {
      const mockTodo = { task: 'Old Task', save: jest.fn().mockResolvedValue({ task: 'Updated Task' }) };
      Todo.findById.mockResolvedValue(mockTodo);

      const response = await request(app)
        .patch('/todos/updatetodo')
        .set('Authorization', `Bearer ${token}`)
        .query({ todoId: 'todoId' })
        .send({ task: 'Updated Task' });

      expect(response.status).toBe(200);
      expect(response.body.task).toBe('Updated Task');
    });
  });

  describe('PUT /todos/deletetodo', () => {
    it('should delete a todo', async () => {
      Todo.findById.mockResolvedValue({ _id: 'todoId' });
      Todo.findByIdAndDelete.mockResolvedValue({ _id: 'todoId' });

      const response = await request(app)
        .put('/todos/deletetodo')
        .set('Authorization', `Bearer ${token}`)
        .query({ todoId: 'todoId' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Todo deleted successfully.');
    });
  });
});
