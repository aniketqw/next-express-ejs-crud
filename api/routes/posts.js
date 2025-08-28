import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data', 'posts.json');

function readPosts() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writePosts(posts) {
  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2));
}

const router = Router();

// -------- EJS SSR ROUTES --------
router.get('/posts', (req, res) => {
  const posts = readPosts();
  res.render('index', { posts });
});

router.get('/posts/new', (req, res) => {
  res.render('form', { post: { title: '', body: '' }, action: '/posts', method: 'POST', button: 'Create' });
});

router.post('/posts', (req, res) => {
  const posts = readPosts();
  const { title, body } = req.body;
  const newPost = { id: nanoid(8), title, body, createdAt: new Date().toISOString() };
  posts.push(newPost);
  writePosts(posts);
  res.redirect('/posts');
});

router.get('/posts/:id', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).send('Not found');
  res.render('show', { post });
});

router.get('/posts/:id/edit', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).send('Not found');
  res.render('form', { post, action: `/posts/${post.id}?_method=PUT`, method: 'POST', button: 'Update' });
});

router.put('/posts/:id', (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).send('Not found');
  posts[idx] = { ...posts[idx], title: req.body.title, body: req.body.body };
  writePosts(posts);
  res.redirect('/posts/' + req.params.id);
});

router.delete('/posts/:id', (req, res) => {
  const posts = readPosts();
  const next = posts.filter(p => p.id !== req.params.id);
  writePosts(next);
  res.redirect('/posts');
});

// -------- JSON API ROUTES (/api) --------
router.get('/api/posts', (req, res) => {
  res.json(readPosts());
});

router.get('/api/posts/:id', (req, res) => {
  const post = readPosts().find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

router.post('/api/posts', (req, res) => {
  const posts = readPosts();
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const newPost = { id: nanoid(8), title, body: body || '', createdAt: new Date().toISOString() };
  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

router.put('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const updated = { ...posts[idx], title: req.body.title ?? posts[idx].title, body: req.body.body ?? posts[idx].body };
  posts[idx] = updated;
  writePosts(posts);
  res.json(updated);
});

router.delete('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = posts[idx];
  posts.splice(idx, 1);
  writePosts(posts);
  res.json({ ok: true, deleted });
});

export default router;
