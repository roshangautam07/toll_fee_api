import { createLogger, format as _format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import CustomTransport from '../helpers/customTransport.js';
import { today } from '../helpers/helper.js';
const dailyRotateLog =  new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

const loggers = createLogger({
  level: 'info',
  format: _format.json(),
  transports: [
    // new winston.transports.File({ filename: 'audit-trail.log' }),
    new DailyRotateFile({
      filename: 'log/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
    // dailyRotateLog,
    new CustomTransport({
      filename: `log/jsonlog/${today()}.json`,
      handleExceptions: true
  })

  ],
});
// loggers.add(new CustomTransport({
//   filename: `logs/jsonlog/${currentDate()}.json`,
//   handleExceptions: true
// }));

export default loggers;