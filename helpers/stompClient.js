import { Client } from '@stomp/stompjs';
import { WebSocket } from 'ws'; // Required for Node.js environment
import EventEmitter from 'events';
import crypto from 'crypto';

/**
 * Node.js STOMP Client for NepalPay
 * Handles WebSocket connection, subscription, and status updates.
 */
export class NepalPayStompClient {
    constructor() {
        this.activeClients = new Map(); // Stores the STOMP Client instances
        this.callbacks = new Map();     // Stores callbacks per traceId
    }

    /**
     * Connect and Subscribe
     */
    async connectAndSubscribe(validationTraceId, terminalLabel, acquirerId, username, callback) {
        console.info(`[NepalPay] Connecting - TraceId: ${validationTraceId}, Terminal: ${terminalLabel}`);

        this.callbacks.set(validationTraceId, callback);

        try {
            // 1. Build the Request Data (Encrypted)
            const requestData = await this.buildCheckTxnStatusRequest(terminalLabel, validationTraceId, acquirerId, username);
            console.log(JSON.stringify(requestData))
            // 2. Initialize STOMP Client
            const client = new Client({
                brokerURL: 'wss://ws.nepalpay.com.np/nqrws', // Replace with ApiRoute.NEPALPAY_WS_URL
                webSocketFactory: () => new WebSocket('wss://ws.nepalpay.com.np/nqrws'),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                logRawCommunication: false,
                debug: function (str) {
        console.log('STOMP Debug:', str);
    },
            });

            this.activeClients.set(validationTraceId, client);

            client.onConnect = (frame) => {
                console.info(`Connected to NepalPay for TraceId: ${validationTraceId}`);

                // 3. Subscribe to the status endpoint
                const subscription = client.subscribe('/nqrws/check-txn-status', (message) => {
                    this.handleStatusMessage(validationTraceId, message.body);
                });
                console.log('SUBsss',subscription)
                console.log(frame)
                // 4. Send the Check Status Request
                console.info(`Sending request for TraceId: ${validationTraceId}`);
                client.publish({
                    destination: '/nqrws/check-txn-status', // Replace with ApiRoute.NEPALPAY_WS_SEND_ENDPOINT
                    body: requestData
                });
            };

            client.onStompError = (frame) => {
                this.notifyError(validationTraceId, `STOMP Error: ${frame.headers['message']}`);
                this.cleanup(validationTraceId);
            };

            client.onWebSocketError = (error) => {
                this.notifyError(validationTraceId, `WebSocket Transport Error: ${error.message}`);
                this.cleanup(validationTraceId);
            };

            client.activate();

        } catch (error) {
            console.error(`Setup failed for TraceId ${validationTraceId}:`, error.message);
            this.notifyError(validationTraceId, error.message);
            this.cleanup(validationTraceId);
        }
    }

    handleStatusMessage(validationTraceId, message) {
        console.info(`Received message for TraceId ${validationTraceId}: ${message}`);

        try {
            const data = JSON.parse(message);
            console.log('HANDLE MESSAGE',message)
            if (data.status) {
                const { status, message: statusMsg, txn_id } = data;
                const callback = this.callbacks.get(validationTraceId);

                if (callback) {
                    callback.onStatusUpdate(true, status, statusMsg || "", txn_id || null);

                    if (status === 'COMPLETED' || status === 'FAILED') {
                        this.cleanup(validationTraceId);
                    }
                }
            }
        } catch (e) {
            this.notifyError(validationTraceId, "Failed to parse JSON response");
        }
    }
     encryptWithPublicKeyString(plainText, publicKeyStr) {
    try {
        // 1. Clean the string (remove any accidental spaces/newlines)
        const cleanedKey = publicKeyStr.replace(/\s+/g, '');

        // 2. Create a Public Key object directly from the Base64 DER string
        // This is the Node.js equivalent of Java's X509EncodedKeySpec
        const publicKey = crypto.createPublicKey({
            key: Buffer.from(cleanedKey, 'base64'),
            format: 'der',
            type: 'spki',
        });

        // 3. Encrypt using the key object
        const encryptedBuffer = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING
            },
            Buffer.from(plainText, 'utf8')
        );

        return encryptedBuffer.toString('base64');

    } catch (err) {
        // Detailed logging to see what OpenSSL is complaining about
        console.error("Internal Encryption Error Details:", err);
        throw new Error('Encryption failed: ' + err.message);
    }
}

    async buildCheckTxnStatusRequest(terminalLabel, validationTraceId, acquirerId, username) {
        // Fetch credentials from your service
        const creds = 'NICAIMARK@999';
        const apiKey = 'afHFLRZYJPCtKkdjUQH9ugMJ1ttULcyCQ1dTGXWbJSA='
        const publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgOvqgqCGlyZ78v/rIe" +
        "INAWsAweLaLJbW+ckoA53hDMKnFCN5XSj681MVcXtBja7VT+VMnrv+q8CRh7ye52kM6o0IVdZxq8BRHnGJofd5gmnRbD4jPjIBhW" +
        "197B0FCGOfvTSIVJyJeI81mYvSCmWgyHySlDK3dX0yJjVy2bclKETTkkYxTRw6U3by2yhS7DOWozImw1cbbNo+z3OPp5W/GtM7uOHG" +
        "N22DXWpog01iO7emZ07f/JgEldeQvIyRKO+yrpSoWJrpt8D8LlvC1DuU2S2natroX4vHisbyIUA5j9Fmr8LjCpJwb9ftaJerTfYlE1ROWdbu5O2KKC8poXjtvQIDAQAB"
        // RSA Encryption (Use the encryptWithPublicKeyString function we discussed earlier)
        const encryptedApiToken = this.encryptWithPublicKeyString(apiKey, publicKey);

        return {
            // apiToken: encryptedApiToken,
            // merchantId: terminalLabel,
            // requestId: validationTraceId,
            // username: creds.username
            api_token: encryptedApiToken,
            merchant_id: 'Terminal1',
            request_id: validationTraceId,
            username: creds.username
        };
    }

    notifyError(validationTraceId, errorMsg) {
        const callback = this.callbacks.get(validationTraceId);
        if (callback && callback.onError) {
            callback.onError(errorMsg);
        }
    }

    cleanup(validationTraceId) {
        const client = this.activeClients.get(validationTraceId);
        if (client) {
            client.deactivate();
            this.activeClients.delete(validationTraceId);
        }
        this.callbacks.delete(validationTraceId);
    }
}