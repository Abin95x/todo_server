# Todo Backend
## Description
This project is a backend service for managing todos. It uses Express.js, Node.js, MongoDB, the GitHub Gist API, and Jest for testing.

## Technologies Used
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Jest](https://jestjs.io/) (for testing)
- [GitHub Gist API](https://docs.github.com/en/rest/gists) (for exporting data)
  
## Running the App
- To start the application, 
  use:   `npm start`
- To run the tests,
 use: `npm test
`

## Contact
For any inquiries, please contact: abinpv95@gmail.com

## Environment Setup
Create a .env file and paste the below env variables(please add your GitHub token)
```env
MONGO_URL=mongodb://localhost:27017/todos
PORT=3000
FRONT_END_URL=http://localhost:5173
SECRET_KEY_USER=hellofr!end
GITHUB_TOKEN=your_github_token_here


