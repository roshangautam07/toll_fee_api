import morgan from "morgan";
import { existsSync, mkdirSync } from "fs";
import { createStream } from "rotating-file-stream";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default app => {
  app.use(
    morgan("dev", {
      skip: function(req, res) {
        return res.statusCode < 400;
      }
    })
  );

  const logDirectory = path.join(__dirname, "../log");
  existsSync(logDirectory) || mkdirSync(logDirectory);
  
  const accessLogStream = createStream("access.log", {
    interval: "1d", // rotate daily
    path: logDirectory
  });

  app.use(morgan("combined", { stream: accessLogStream }));
};