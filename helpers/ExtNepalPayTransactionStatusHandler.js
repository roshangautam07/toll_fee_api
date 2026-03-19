/**
 * Handles NepalPay transaction status updates from WebSocket.
 * Coordinates DB updates, MQTT notifications, and WebSocket messages to the frontend.
 */
export class ExtNepalPayTransactionStatusHandler {
    constructor(stompClient, webSocketHandler) {
        this.stompClient = stompClient;
        this.webSocketHandler = webSocketHandler;
    }

    /**
     * Start monitoring transaction status after QR generation.
     */
    startMonitoring(validationTraceId, terminalLabel, acquirerId, username, terminalId, amount) {
        
        // Define the callback object expected by our StompClient
        const callback = {
            onStatusUpdate: async (success, status, message, txnId) => {
                console.info(`>>> CALLBACK onStatusUpdate - traceId: ${validationTraceId}, status: ${status}`);
                
                try {
                    if (status === "ENTR") {
                        console.info(`Connection established for external traceId: ${validationTraceId}`);
                    }

                    if (status === "COMPLETED" && success) {
                        await this.handleSuccess(validationTraceId, terminalId, amount, message, txnId);
                    } else if (status === "FAILED" || (status === "COMPLETED" && !success)) {
                        await this.handleFailure(validationTraceId, terminalId, amount, message, txnId);
                    }
                } catch (error) {
                    console.error(`Error handling status update for ${validationTraceId}:`, error.message);
                }
            },

            onError: async (error) => {
                console.error(`WebSocket error for traceId ${validationTraceId}: ${error}`);
                try {
                    await this.handleFailure(validationTraceId, terminalId, amount, error, "N/A");
                } catch (e) {
                    console.error(`Error handling failure for ${validationTraceId}:`, e.message);
                }
            }
        };

        // Call the StompClient we converted earlier
        this.stompClient.connectAndSubscribe(
            validationTraceId,
            terminalLabel,
            acquirerId,
            username,
            callback
        );
    }

    stopMonitoring(validationTraceId) {
        this.stompClient.cleanup(validationTraceId);
    }

    // SUCCESS FLOW
    async handleSuccess(validationTraceId, terminalId, amount, message, txnId) {
       
        console.info(`SUCCESS handled for traceId ${validationTraceId}`);
    }

    // FAILURE FLOW
    async handleFailure(validationTraceId, terminalId, amount, message, txnId) {
        console.info(`FAILURE handled for traceId ${validationTraceId}`);
    }


    // CLIENT NOTIFICATION (WebSocket + MQTT)
    async notifyClient(terminalId, status, message, amount, validationTraceId) {
        // 1. Notify Frontend via WebSocket
        const sessionRes = { validationTraceId, status, message };
        // this.webSocketHandler.sendMessageToSession(validationTraceId, sessionRes);

    }
}