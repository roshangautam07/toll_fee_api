import multer, { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));

const maxSize = 100 * 1024 * 1024;
const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('application/vnd.android.package')
  ) {
    cb(null, true);
  } else {
    cb('Please upload only excel file.', false);
  }
};

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/static');
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(
      null,
      `${Date.now()}-toll-fee-${randomBytes(16).toString('hex')}-${
        file.originalname
      }`
    );
  },
});

const uploadExcelFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: excelFilter,
}).single('file');

let uploadFileMiddleware = promisify(uploadExcelFile);
export default uploadFileMiddleware;
