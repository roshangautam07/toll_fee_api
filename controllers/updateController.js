import fs from 'fs';
import { fileURLToPath } from 'url';
import path ,{ dirname}  from 'path';
import * as url from 'url';
import Apk from "node-apk";
    const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));
const __dirnames = url.fileURLToPath(new URL('.', import.meta.url));
    

export const appUpdate = (req, res, next) => {
    const response = {
        apkUrl: "http://143.110.254.245:9006/api/download/toll-fee-2.0.apk",
        forceUpdate: false,
        versionCode: "2",
        versionName: "2.0"
    };
    // fs.readFile(`${__dirnames}/${req.params.id}`, (err, data) => {
    //     if (err) return res.status(500).json({message:err})
    //     let RE = JSON.parse(data);
    //     return res.json(RE);

    // });
    return res.json(response);
}

export const  downloadAPK = async(req, res, next) =>{
    const paths = `${__dirname}/public/static/`;
    const file = 'toll-fee-1.0.apk';
    const apk = new Apk.Apk(paths + req.params.id);
    const apkInfo = await apk.getManifestInfo();
    console.log(apkInfo.versionCode);
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

export const uploadApk = (req, res, next) => {

}