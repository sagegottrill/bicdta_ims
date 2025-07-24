const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data stores
let users = [
  { id: 1, role: 'admin', email: 'admin.user@bictda.bo.gov.ng', password: 'admin123', name: 'Admin User' },
  { id: 2, role: 'instructor', email: 'instructor@bictda.bo.gov.ng', password: 'instructor123', name: 'John Instructor' }
];
let trainees = [];
let centres = [];
let trainers = [];
let courses = [];

// Authentication endpoint
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ success: true, user: { id: user.id, role: user.role, name: user.name, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// CRUD for trainees
app.get('/api/trainees', (req, res) => res.json(trainees));
app.post('/api/trainees', (req, res) => {
  const trainee = { ...req.body, id: Date.now().toString() };
  trainees.push(trainee);
  res.json(trainee);
});
app.put('/api/trainees/:id', (req, res) => {
  const idx = trainees.findIndex(t => t.id === req.params.id);
  if (idx !== -1) {
    trainees[idx] = { ...trainees[idx], ...req.body };
    res.json(trainees[idx]);
  } else {
    res.status(404).json({ message: 'Trainee not found' });
  }
});
app.delete('/api/trainees/:id', (req, res) => {
  trainees = trainees.filter(t => t.id !== req.params.id);
  res.json({ success: true });
});

// CRUD for centres
app.get('/api/centres', (req, res) => res.json(centres));
app.post('/api/centres', (req, res) => {
  const centre = { ...req.body, id: Date.now().toString() };
  centres.push(centre);
  res.json(centre);
});
app.put('/api/centres/:id', (req, res) => {
  const idx = centres.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    centres[idx] = { ...centres[idx], ...req.body };
    res.json(centres[idx]);
  } else {
    res.status(404).json({ message: 'Centre not found' });
  }
});
app.delete('/api/centres/:id', (req, res) => {
  centres = centres.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// CRUD for trainers
app.get('/api/trainers', (req, res) => res.json(trainers));
app.post('/api/trainers', (req, res) => {
  const trainer = { ...req.body, id: Date.now().toString() };
  trainers.push(trainer);
  res.json(trainer);
});
app.put('/api/trainers/:id', (req, res) => {
  const idx = trainers.findIndex(t => t.id === req.params.id);
  if (idx !== -1) {
    trainers[idx] = { ...trainers[idx], ...req.body };
    res.json(trainers[idx]);
  } else {
    res.status(404).json({ message: 'Trainer not found' });
  }
});
app.delete('/api/trainers/:id', (req, res) => {
  trainers = trainers.filter(t => t.id !== req.params.id);
  res.json({ success: true });
});

// CRUD for courses
app.get('/api/courses', (req, res) => res.json(courses));
app.post('/api/courses', (req, res) => {
  const course = { ...req.body, id: Date.now().toString() };
  courses.push(course);
  res.json(course);
});
app.put('/api/courses/:id', (req, res) => {
  const idx = courses.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    courses[idx] = { ...courses[idx], ...req.body };
    res.json(courses[idx]);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});
app.delete('/api/courses/:id', (req, res) => {
  courses = courses.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// Analytics endpoint (simple example)
app.get('/api/analytics/summary', (req, res) => {
  res.json({
    totalTrainees: trainees.length,
    totalCentres: centres.length,
    totalTrainers: trainers.length,
    totalCourses: courses.length
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 