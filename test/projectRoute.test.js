import request from 'supertest';
import app from '../server'; // Adjust the import based on your setup
import {
    addProject,
    getProjects,
    editProject,
    deleteProject,
    getProjectDetails,
    createMd
} from '../controllers/projectController.js';
import auth from '../middlewares/auth.js';
import sanitizeInput from '../middlewares/sanitization.js';

jest.mock('../controllers/projectController.js');
jest.mock('../middlewares/auth.js');
jest.mock('../middlewares/sanitization.js');

describe('Project Router', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    describe('POST /addproject', () => {
        it('should add a project and return 200', async () => {
            auth.mockImplementation((req, res, next) => next());
            sanitizeInput.mockImplementation((req, res, next) => next());
            addProject.mockImplementation((req, res) => res.status(200).json({ message: 'Project added' }));

            const response = await request(app)
                .post('/projects/addproject')
                .send({ name: 'New Project', description: 'Project Description' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Project added');
        });

        it('should return 401 if authentication fails', async () => {
            auth.mockImplementation((req, res, next) => res.status(401).json({ message: 'Unauthorized' }));

            const response = await request(app)
                .post('/projects/addproject')
                .send({ name: 'New Project', description: 'Project Description' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });
    });

    describe('GET /getprojects', () => {
        it('should get all projects and return 200', async () => {
            auth.mockImplementation((req, res, next) => next());
            getProjects.mockImplementation((req, res) => res.status(200).json({ projects: [] }));

            const response = await request(app)
                .get('/projects/getprojects');

            expect(response.status).toBe(200);
            expect(response.body.projects).toEqual([]);
        });
    });

    // Similar test cases for other routes

    describe('GET /getprojectdetails', () => {
        it('should return project details and return 200', async () => {
            auth.mockImplementation((req, res, next) => next());
            getProjectDetails.mockImplementation((req, res) => res.status(200).json({ project: { name: 'Project 1' } }));

            const response = await request(app)
                .get('/projects/getprojectdetails')
                .query({ projectId: '1' });

            expect(response.status).toBe(200);
            expect(response.body.project.name).toBe('Project 1');
        });
    });

    describe('PATCH /editproject', () => {
        it('should edit a project and return 200', async () => {
            auth.mockImplementation((req, res, next) => next());
            sanitizeInput.mockImplementation((req, res, next) => next());
            editProject.mockImplementation((req, res) => res.status(200).json({ message: 'Project edited' }));

            const response = await request(app)
                .patch('/projects/editproject')
                .send({ projectId: '1', name: 'Updated Project' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Project edited');
        });
    });

    describe('PUT /deleteproject', () => {
        it('should delete a project and return 200', async () => {
            auth.mockImplementation((req, res, next) => next());
            deleteProject.mockImplementation((req, res) => res.status(200).json({ message: 'Project deleted' }));

            const response = await request(app)
                .put('/projects/deleteproject')
                .send({ projectId: '1' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Project deleted');
        });
    });

    describe('GET /createmd', () => {
        it('should create a markdown file and return 200', async () => {
            auth.mockImplementation((req, res, next) => next());
            createMd.mockImplementation((req, res) => res.status(200).json({ message: 'Markdown file created' }));

            const response = await request(app)
                .get('/projects/createmd');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Markdown file created');
        });
    });
});
