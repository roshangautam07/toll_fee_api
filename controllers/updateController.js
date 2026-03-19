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
import crypto from 'crypto';
import forge from 'node-forge';
import QRCode from 'qrcode';
import axios from 'axios';
import { NepalPayStompClient } from '../helpers/stompClient.js';
import qrcode from 'qrcode-terminal'
import { ExtNepalPayTransactionStatusHandler } from '../helpers/ExtNepalPayTransactionStatusHandler.js';
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
        apkUrl: `${process.env.BASE_URL}:${process.env.PORT}/api/download/${lastDeploument.app_name}`,
        forceUpdate: lastDeploument?.is_force_update,
        versionCode: lastDeploument?.versionCode,
        versionName: lastDeploument?.versionName,
        remarks: lastDeploument?.remarks,
        is_force_update:lastDeploument?.is_force_update
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
            getSocketIo().to(obj[deviceId]).emit('logout',`Device ${deviceId} successfully logged out`);
        });
    } else {
        getSocketIo().emit('logout', 'All device successfully successfully logged out');
    }
    res.json({ message: 'All currently logged-in devices have been logged out' });
}

export async function remoteRestart(req, res, next) {
    const deviceId = req.headers.deviceid; // Access the 'deviceid' header
    // console.log(req.app)
    console.log('DEVICE', deviceId);
    if (deviceId) {
        client.hgetall('mastersocket', (err, obj) => {
            if (err) {
                throw err;
            }
            console.log('DEDIS', obj, obj[deviceId]);
            getSocketIo().to(obj[deviceId]).emit('restart',`Device ${deviceId} successfully reloaded`);
        });
    } else {
        getSocketIo().emit('restart', 'All device is successfully reloaded');
    }
    res.json({ message: 'All currently logged-in devices have been reloaded' });
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

/**
 * Signs data using a PFX file (SHA256withRSA)
 * @param {string} data - The string to sign
 * @param {string} pfxFilePath - Path to the .pfx file
 * @param {string} password - Password for the pfx file
 * @returns {string|null} - Base64 encoded signature
 */
function signToken(data, pfxFilePath, password) {
    try {
        // Read PFX file
        const pfxBuffer = fs.readFileSync(pfxFilePath);

        // Convert to forge buffer
        const p12Der = forge.util.createBuffer(pfxBuffer.toString('binary'));
        const p12Asn1 = forge.asn1.fromDer(p12Der);

        // Parse PKCS#12
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

        // Extract private key
        let privateKey = null;

        for (const safeContent of p12.safeContents) {
            for (const safeBag of safeContent.safeBags) {
                if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
                    privateKey = safeBag.key;
                    break;
                }
            }
            if (privateKey) break;
        }

        if (!privateKey) {
            throw new Error('Private key not found in the keystore.');
        }

        // Convert forge key to PEM
        const privateKeyPem = forge.pki.privateKeyToPem(privateKey);

        // Create signature
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(data);
        signer.end();

        const signature = signer.sign(privateKeyPem, 'base64');

        console.log('[ShaUtils] => token :', signature);
        return signature;

    } catch (err) {
        console.error(err);
        return null;
    }
}
/**
 * Generates the QR Provider Token string
 * @param {Object} body - The NepalPayProviderQrDto equivalent object
 * @returns {string}
 */

function verifySignature(data, signatureBase64, pfxFilePath, password) {
    try {
        const pfxBuffer = fs.readFileSync(pfxFilePath);

        // Parse PFX
        const p12Der = forge.util.createBuffer(pfxBuffer.toString('binary'));
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

        // Extract certificate (public key)
        let cert = null;

        for (const safeContent of p12.safeContents) {
            for (const safeBag of safeContent.safeBags) {
                if (safeBag.type === forge.pki.oids.certBag) {
                    cert = safeBag.cert;
                    break;
                }
            }
            if (cert) break;
        }

        if (!cert) {
            throw new Error('Certificate not found in PFX');
        }

        const publicKeyPem = forge.pki.certificateToPem(cert);

        // Verify signature
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(data);
        verifier.end();

        const isValid = verifier.verify(publicKeyPem, signatureBase64, 'base64');

        console.log('Signature valid:', isValid);
        return isValid;

    } catch (err) {
        console.error(err);
        return false;
    }
}
function generateQrProviderToken(body) {
    // 1. Convert amount (assumed long/integer) to decimal (divide by 100)
    // Java: BigDecimal.valueOf(amount).divide(100)
    const amountDec = (body.transactionAmount / 100).toFixed(2);
    console.log('[Amount] =>',amountDec)
    // 2. Build the comma-separated string
    // Using a Template Literal is the modern JS equivalent of StringBuilder
    const token = [
        body.acquirerId,
        body.merchantId,
        body.merchantCategoryCode,
        body.transactionCurrency,
        amountDec,
        body.billNumber,
        body.username
    ].join(',');

    return token;
}
const authorization = (username, password) => {

    // Concatenate username and password
    const credentials = `${username}:${password}`;

    // Convert to Base64
    const base64Credentials = Buffer.from(credentials).toString('base64');

    // Create Authorization header
    const authorizationHeader = `Basic ${base64Credentials}`;

    console.log("Authorization Header:", authorizationHeader);
    return authorizationHeader;
}
const generateQR = async() => {
    const data = `{
"pointOfInitialization": 12,
"acquirerId": "00002301",
"merchantId": "2301R75BAOR",
"merchantName": "INIRA DIAMOND PVT LTD",
"merchantCategoryCode": 5944,
"merchantCountry": "NP",
"merchantCity": "Kathmandu",
"merchantPostalCode": "4600",
"merchantLanguage": "en",
"transactionCurrency": 524,
"transactionAmount": "1.00",
"valueOfConvenienceFeeFixed": "0.00",
"billNumber": "0",
"referenceLabel": null,
"mobileNo": null,
"terminalLabel": "Terminal1",
"purposeOfTransaction": "Bill payment",
"additionalConsumerDataRequest": null,
"loyaltyNumber": null,
"token": "hCa5C2wbYOH7FpYDm1Syl4gWCpwp5VzhM8a1rpd5PH50VIaxyfebsRjPqpV2z80LwZGm1JhXSrx6Cle0DFRKwpcUtWStTN/+d23eiy3zk0E7tuU87jgAU6uW0H0s4tZHCgFkC/XGohPD1oVpMir0jxtpJDmd14xusiJc5U/R15oVEy2Si045ZS8QPIABdV2lKvwYrOHCS4VcBYgdCNXlVOjsiOPVlLo89+s+QeJBuEnqdNxHnYIup1Bn4aKGJs59eShD+YcLeM/l/uEZSctDREuAZYWO6mEff34ZzTYSEefvCgGvA9MFeZvXgSPaoyEK5DulfK0zu2/E7dX4JzKB4g=="
}`;
    const parse = JSON.parse(data);
    const request = await axios.post('https://opennpi.connectips.com/qr/generateQR', data, {
        headers: {
                'Content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': authorization('nicaimark', 'n!c!M@RKA@1262')
            }
    });
    console.log(request?.data)
    return request

}
export async function generateToken(req, res, next) {
    try {
        const CERT_PASSWORD = 'NIC@imark';
        const data = {
            acquirerId: '00002301',
            merchantId: '2301R75BAOR',
            merchantCategoryCode: '5944',
            transactionCurrency: '524',
            transactionAmount: '100', // 100 Paisa = 1.00 NPR
            billNumber: '0',
            username: 'NICAIMARK@999'
        };

        const paths = `${__dirname}/public/static/NICAIMARK.pfx`;

        // 1. Generate and Sign Token (For the QR Generation Request)
        const tokenString = generateQrProviderToken(data);
        const signature = signToken(tokenString, paths, CERT_PASSWORD);
        const isValid = verifySignature(tokenString, signature, paths, CERT_PASSWORD);

        // 2. Call your NepalPay QR Generation API
        const qrResponse = await generateQR(); 
        const qrData = qrResponse?.data?.data;

        if (!qrData || !qrData.qrString) {
            throw new Error("Failed to generate QR string from NepalPay");
        }

        console.log('Validation Trace ID:', qrData.validationTraceId);

        // 3. Define the Callback for the WebSocket Status
        const statusCallback = {
            onStatusUpdate: (isSuccess, status, message, txnId) => {
                console.log(`[WebSocket Update] Status: ${status} | Msg: ${message} | TxnId: ${txnId}`);
                
                if (status === 'COMPLETED') {
                    console.log("✅ SUCCESS: Transaction finished perfectly.");
                    // TODO: Update your database here using qrData.validationTraceId
                } else if (status === 'FAILED') {
                    console.log("❌ FAILED: Transaction was rejected or cancelled.");
                }
            },
            onError: (error) => {
                console.error(`[WebSocket Error]:`, error);
            }
        };

        // 4. Start Monitoring the Transaction via STOMP
        // Using terminalId 'Terminal1' as per your requirements
        const stompClient = new NepalPayStompClient();
        // await stompClient.connectAndSubscribe(
        //     qrData.validationTraceId,
        //     'Terminal1',
        //     data.acquirerId,
        //     data.username,
        //     statusCallback
        // );
        const monitor = new ExtNepalPayTransactionStatusHandler(stompClient);
        monitor.startMonitoring(
            qrData.validationTraceId,
            'Terminal1',
            data.acquirerId,
            data.username,
        )

        // 5. Generate QR Code for Terminal/Console Display
        qrcode.generate(qrData.qrString, { small: true });

        // 6. Return response to UI
        return res.json({
            signature: signature,
            isValid: isValid,
            traceId: qrData.validationTraceId,
            qrImage: await QRCode.toDataURL(qrData.qrString)
        });

    } catch (error) {
        console.error("Token Generation Error:", error);
        next(error);
    }
}
