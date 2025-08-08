const express = require('express');
const cors = require('cors'); // optional
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // remove if you don't need CORS

// In-memory store (no DB required)
let books = [
  { id: 1, title: '1984', author: 'George Orwell' },
  { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien' }
];

function nextId() {
  return books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
}

/* GET /books -> list all books */
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

/* GET /books/:id -> single book */
app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

/* POST /books -> add a book */
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'title and author required' });

  const newBook = { id: nextId(), title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

/* PUT /books/:id -> update a book */
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, author } = req.body;
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });

  // update only provided fields
  books[idx] = { ...books[idx], ...(title && { title }), ...(author && { author }) };
  res.json(books[idx]);
});

/* DELETE /books/:id -> remove a book */
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });

  const removed = books.splice(idx, 1)[0];
  res.json(removed); // or res.status(204).send()
});

/* basic error handler */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
