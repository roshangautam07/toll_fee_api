import fs from 'fs';
import { fileURLToPath } from 'url';
import path ,{ dirname}  from 'path';
import * as url from 'url';
    const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));
const __dirnames = url.fileURLToPath(new URL('.', import.meta.url));
    

export const appUpdate = (req, res, next) => {
    const response = {
        apkUrl: "https://github.com/mikehardy/react-native-update-apk/releases/download/v3.0.1/rn-update-apk-example-3.0.1.apk",
        forceUpdate: false,
        versionCode: "1",
        versionName: "1.0"
    };
    fs.readFile(`${__dirnames}/${req.params.id}`, (err, data) => {
        if (err) return res.status(500).json({message:err})
        let RE = JSON.parse(data);
        return res.json(RE);

    });
}

export const  downloadAPK = (req, res, next) =>{
    const paths = `${__dirname}/public/static/`;
    const file = 'toll-fee-1.0.apk';
  fs.access(paths, fs.constants.F_OK, function (error) {
    if (error) {
      return res.status(500).json({message:error})
    }fs.stat(`${__dirname}/public/static/${req.params.id}`, (err, fileStats) => {
        if (err) {
            return res.status(500).json({message:error})
        } else {
            console.log(fileStats)
            res.writeHead(200, {
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Length':fileStats.size
            //   'Content-Disposition': `attachment; filename=${req.params.id}`,
            });
            fs.createReadStream(paths + req.params.id).pipe(res);
        }
      })
      
    
  });
    
}