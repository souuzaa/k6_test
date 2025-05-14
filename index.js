const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for users
let users = [];

// Basic GET endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// GET users endpoint
app.get('/users', (req, res) => {
  res.json(users);
});

// POST user endpoint
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

// Endpoint with simulated delay for performance testing
app.get('/delayed', async (req, res) => {
  const delay = Math.random() * 1000; // Random delay between 0-1000ms
  await new Promise(resolve => setTimeout(resolve, delay));
  res.json({ message: 'Delayed response', delay });
});

// Clear users endpoint (useful for testing)
app.delete('/users', (req, res) => {
  users = [];
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});