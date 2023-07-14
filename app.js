import dotenv from 'dotenv';
dotenv.config()
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import usersRouter from './routes/users.js';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandller.js';
import notFound from './middleware/notFound.js';
import bodyParser from 'body-parser';
import logger from './helpers/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();
logger(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(
  bodyParser.urlencoded({
      parameterLimit: 100000,
      limit: '100mb',
      extended: true,
  })
);
routes(app, express);
app.disable('x-powered-by');
app.use(errorHandler);
app.use(notFound);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.get('/', (req, res) => {
  res.json('hello')

})


const PORTS = process.env.PORT || 3000
app.listen(PORTS,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORTS}.`);
});

export default app;
