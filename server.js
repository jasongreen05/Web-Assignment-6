import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { Note } from './models/Note.js';

const dbUri = process.env.MONGODB_URI;
const port = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());

// Read all
app.get('/api/notes', async (req, res) => {
  res.json(await Note.find());
});

// Read one
app.get('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Create
app.post('/api/notes', async (req, res) => {
  try { res.status(201).json(await Note.create(req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

// Update
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const note = await Note.findByIdAndUpdate(id, req.body,
      { new: true, runValidators: true });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const note = await Note.findByIdAndDelete(id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.sendStatus(204);
});

// after all routes: nothing matched
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// any other error (bad JSON, database down) -> JSON instead of an HTML page
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

try {
  await mongoose.connect(dbUri);
  console.log('connected to MongoDB');
  app.listen(port);
} catch (err) {
  console.error('DB connection failed:', err.message);
  process.exit(1);
}
