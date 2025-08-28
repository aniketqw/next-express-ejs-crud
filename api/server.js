import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cors from 'cors';
import methodOverride from 'method-override';
import postsRouter from './routes/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// CORS for Next.js frontend
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Routes
app.use('/', postsRouter);

// Home redirect
app.get('/', (req, res) => res.redirect('/posts'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express + EJS server running on http://localhost:${PORT}`);
});
