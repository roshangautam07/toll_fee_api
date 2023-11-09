import dotenv from 'dotenv';
dotenv.config()
import fs from 'fs';
import { fileURLToPath } from 'url';
import path ,{ dirname}  from 'path';
import * as url from 'url';
import Apk from "node-apk";
import uploadFileMiddleware from '../middleware/apkUploader.js';
import { getLastDeployment, saveFileInfo } from '../services/appDeploymentService.js';
import { updateRequest } from '../dto/request/updateRequest.js';
    const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));
const __dirnames = url.fileURLToPath(new URL('.', import.meta.url));
import db from '../models/index.js';
import { getSocketIo,getSocketUser } from '../config/socket.js';
import client from '../config/redis.js';

export const appUpdate = async (req, res, next) => {
    try {
        
        // getSocketIo().emit('update', "message");
    // const { deviceId } = req.params;
    const deviceId = req.headers;
        console.log('DEVICE', deviceId.deviceid)
        const device = deviceId.deviceid ?? 1;
        const deviceList = await db.DeviceInformation.findOne({
            where: {
                serial_number: device,
                status:'active'
            }
        });
        if (!deviceList) {
            return res.json({message:'No update avaliable'})
        }
   
    const response = {
        apkUrl: "http://143.110.254.245:9006/api/download/toll-fee-2.0.apk",
        forceUpdate: false,
        versionCode: "2",
        versionName: "2.0"
    };
    const lastDeploument = await getLastDeployment();
    console.log(lastDeploument);
    const responseData = {
        apkUrl: `http://202.51.1.204:9006/api/download/${lastDeploument.app_name}`,
        forceUpdate: lastDeploument?.is_force_update,
        versionCode: lastDeploument?.versionCode,
        versionName: lastDeploument?.versionName
    };
    // fs.readFile(`${__dirnames}/${req.params.id}`, (err, data) => {
    //     if (err) return res.status(500).json({message:err})
    //     let RE = JSON.parse(data);
    //     return res.json(RE);

    // });
        return res.json(responseData);
    } catch (error) {
        next(error);
    }
}

export const  downloadAPK = async(req, res, next) =>{
    const paths = `${__dirname}/public/static/`;
    const file = 'toll-fee-1.0.apk';
    const apk = new Apk.Apk(paths + req.params.id);
    const apkInfo = await apk.getManifestInfo();

    const deviceId = req.headers;
    console.log(apkInfo.versionCode);
    const device = deviceId.deviceid ?? 1;
        const deviceList = await db.DeviceInformation.findOne({
            where: {
                serial_number: device,
                status:'active'
            }
        });
        if (!deviceList) {
            return res.json({message:'No update avaliable'})
        }
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

export const uploadApk = async(req, res, next) => {

    try {
        console.log(req.headers?.token);
        if (req?.headers?.token != process.env.APK_UPLOAD_KEY) {
            throw 'Unauthorized access'
        }
        console.log(req.files)
        await uploadFileMiddleware(req, res);
        const path = `${__dirname}/public/static/${req.file.filename}`;
        const apk = new Apk.Apk(path);
        const apkInfo = await apk.getManifestInfo();
        console.log(apkInfo);
        const other = JSON.stringify(apkInfo.raw);
        console.log(JSON.parse(other));
        // console.log(JSON.stringify(apkInfo.raw, null, 4));
        if (process.env.APK_PACKAGE_NAME !== apkInfo.package) {
            throw 'Incorrect apk file'
        }
       
        if (req.file === undefined) {
            throw 'Please select excel file';
        }
        const dep = await saveFileInfo(updateRequest(req, apkInfo));
        if (req?.body?.deviceId) {
            
        }else{
            getSocketIo().emit('update', "message");
        }
        res.json(dep);
    } catch (error) {
        next(error)
    }
}

export async function remoteLogOut(req, res, next) {
    const deviceId = req.headers.deviceid; // Access the 'deviceid' header
    // console.log(req.app)
    console.log('DEVICE', deviceId);
    if (deviceId) {
        client.hgetall('mastersocket', (err, obj) => {
            if (err) {
                throw err;
            }
            console.log('DEDIS', obj, obj[deviceId]);
            getSocketIo().to(obj[deviceId]).emit('logout');
        });
    } else {
        getSocketIo().emit('logout', 'message');
    }
    res.json({ message: 'All currently logged-in devices have been logged out' });
}

export async function remoteBillPrint(req,res,next){
    const {deviceId} = req?.params;
    const data = req.body;
    console.log(req.body);
    if (deviceId) {
        client.hgetall('mastersocket', (err, obj) => {
            if (err) {
                throw err;
            }
            console.log('DEDIS', obj, obj[deviceId]);
            getSocketIo().to(obj[deviceId]).emit('print',data);
        });
    }
    res.json({message:'Bill printed',data});
}