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
import { systemCurrentState } from './helpers/filehelper.js';
import fs from 'fs';
import { filePath } from './cli/maintenance.js';
import helmet from 'helmet';
import next from 'next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dev = process.env.NODE_ENV !== 'production';
const apps = next({ dev });
const handle = apps.getRequestHandler();
apps.prepare().then(() => {
  
var app = express();
// enabling the Helmet middleware
// app.use(helmet())
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
  
app.use((req, res, next) => {
  systemCurrentState(fs, filePath, function (data) {
    if (typeof data?.maintenance == 'boolean' && data?.maintenance == true) {
   res.status(503).json({message:'System is under maintainance'})
    }
    next();
  })
})

  routes(app, express);
  app.get('/', (req, res) => {
    return apps.render(req, res, `/main`, req.query)
  })
app.get('/forms', (req, res) => {
  return apps.render(req, res, `/form`);
})
app.get('/list-user', (req, res) => {
  const datas = [{
     id: 1,
     name: 'roshan'
  }, {
     id: 2,
     name: 'gautam'
  }, {
     id: 3,
     name: 'roh'
  }];
  //console.log(data)
  res.pageParams = {
      value: datas
  };
  res.data = datas;
  return apps.render(req, res, '/list')
})
app.get('*', (req, res) => {
  return apps.render(req, res, `${req.path}`, req.query)
})
app.disable('x-powered-by');
app.use(errorHandler);
app.use(notFound);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



const PORTS = process.env.PORT || 3000
app.listen(PORTS,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORTS}.`);
});
})

// export default app;
