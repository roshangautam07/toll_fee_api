import uWS from './uWebSockets.js-20.30.0/uws.js';
// import client from './config/redis.js';
import { v4 as uuidv4 } from 'uuid';

const decoder = new TextDecoder('utf-8');

// ─── State ────────────────────────────────────────────────────────────────────
let uwsApp;                      // uWS app instance (set in socketConnection)
let sockets = {};              // userId  → socketId
let wsMap = new Map();       // socketId → ws object
let rooms = new Map();       // roomId   → Set<socketId>

// ─── Helpers ──────────────────────────────────────────────────────────────────
const send = (ws, obj) => {
    try { ws.send(JSON.stringify(obj)); } catch (_) { /* socket already gone */ }
};

const publish = (app, topic, obj) => {
    app.publish(topic, JSON.stringify(obj));
};

// ─── Binary frame relay ───────────────────────────────────────────────────────
/**
 * Binary frame layout (set by Android ScreenShareService):
 *
 *   Byte 0        : frame type  (0x01 = screen frame)
 *   Byte 1        : roomId byte length (uint8, max 255)
 *   Bytes 2..N    : roomId UTF-8 bytes
 *   Bytes N+1 ... : raw JPEG payload
 *
 * The server reads the roomId from the header and publishes the entire raw
 * ArrayBuffer to that room topic as a binary message.  Every browser subscriber
 * receives an ArrayBuffer which it parses with the same header layout.
 *
 * No Base64 encoding, no JSON wrapping – the bytes flow through unchanged.
 */
const FRAME_TYPE_SCREEN = 0x01;

const relayBinaryFrame = (ws, rawMsg) => {
    // rawMsg is an ArrayBuffer in uWS message handlers
    const view = new DataView(rawMsg);
    if (view.byteLength < 2) return;

    const frameType = view.getUint8(0);
    if (frameType !== FRAME_TYPE_SCREEN) {
        console.warn(`Unknown binary frame type: ${frameType} from ${ws.id}`);
        return;
    }

    const roomIdLen = view.getUint8(1);
    const headerSize = 2 + roomIdLen;
    if (view.byteLength < headerSize + 1) return;   // need at least 1 JPEG byte

    const roomId = decoder.decode(new Uint8Array(rawMsg, 2, roomIdLen));
    if (!roomId) return;

    if (!rooms.has(roomId)) {
        // Android connected before any browser joined – drop frame silently
        return;
    }

    // Publish the raw binary buffer to all room subscribers (browsers)
    // isBinary=true tells uWS to send a binary WebSocket frame
    uwsApp.publish(roomId, rawMsg, true);
};

// ─── Redis-backed Socket → userId map ────────────────────────────────────────
const saveSocketMap = (userId, socketId) => {
    client.hmset('mastersocket', { [userId]: socketId }, err => {
        if (err) throw err;
        console.log(`Master socket updated: ${userId} → ${socketId}`);
    });
};

const removeSocketMap = (userId) => {
    if (userId) {
        client.hdel('mastersocket', [userId], err => {
            if (err) throw err;
        });
    }
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const socketConnection = (port = 3000) => {
    uwsApp = uWS.App();

    uwsApp.ws('/ws', {
        compression: uWS.SHARED_COMPRESSOR,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout: 60,

        // ── open ────────────────────────────────────────────────────────────
        open(ws) {
            ws.id = uuidv4();
            wsMap.set(ws.id, ws);

            console.log(`⚡: ${ws.id} user just connected!`);

            ws.subscribe('broadcast');
            ws.subscribe(ws.id);          // private channel
        },

        // ── message ─────────────────────────────────────────────────────────
        message(ws, rawMsg, isBinary) {

            // ── Binary path: screen frame from Android ──────────────────────
            if (isBinary) {
                relayBinaryFrame(ws, rawMsg);
                return;
            }

            // ── Text path: JSON control messages (all existing logic unchanged)
            let data;
            try {
                data = JSON.parse(decoder.decode(rawMsg));
            } catch {
                console.error('Bad JSON from', ws.id);
                return;
            }
            console.log('data', data);
            const { event } = data;

            switch (event) {

                // Mirrors: socket.on('connected', userId => { ... })
                case 'connected': {
                    const { userId } = data;
                    console.log('IDS', userId);
                    sockets[userId] = ws.id;
                    ws.userId = userId;
                    // saveSocketMap(userId, ws.id);
                    console.log('UserIddd', userId);
                    console.log('socks', sockets);
                    break;
                }

                // Mirrors: socket.on('success', data => socket.broadcast.emit('login', data))
                case 'success': {
                    console.log('success event, username:', data.username);
                    uwsApp.publish('broadcast', JSON.stringify({ event: 'login', ...data }));
                    break;
                }

                // Mirrors: socket.on('loading', data => ...)
                case 'loading': {
                    console.log('Loading....', data);
                    break;
                }

                // Mirrors: socket.on('billingError', data => { broadcast 'errorBill'; log })
                case 'billingError': {
                    console.log('Error....', data);
                    uwsApp.publish('broadcast', JSON.stringify({ event: 'errorBill', ...data }));
                    break;
                }

                // Mirrors: socket.on('dashboard', data => ...)
                case 'dashboard': {
                    console.log('Dashboard of:', data);
                    break;
                }

                // Mirrors: socket.on('billing', data => { broadcast 'bill' })
                case 'billing': {
                    console.log('Billing of:', data);
                    uwsApp.publish('broadcast', JSON.stringify({ event: 'bill', ...data }));
                    break;
                }

                // Mirrors: socket.on('api', async data => { ... })
                case 'api': {
                    console.log('API of:', data);
                    break;
                }

                // Mirrors: socket.on('print', data => ...)
                case 'print': {
                    console.log('Print of:', data);
                    break;
                }

                // Mirrors: socket.on('join-room', roomId => socket.join(roomId))
                case 'join-room': {
                    const { roomId, role } = data;

                    // 1. Validation: Ensure role is provided
                    if (role !== 'android-screen' && role !== 'web-screen') {
                        send(ws, { event: 'error', message: 'Invalid role specified' });
                        break;
                    }

                    // 2. Initialize room state if it doesn't exist
                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, { 'android-screen': null, 'web-screen': null });
                    }

                    const currentRoom = rooms.get(roomId);

                    // 3. Check if the slot for this role is already taken
                    if (currentRoom[role]) {
                        console.warn(`Join rejected: Room ${roomId} already has a ${role}`);
                        send(ws, {
                            event: 'room-full',
                            message: `A ${role} is already connected to this room.`
                        });
                        break;
                    }

                    // 4. Assign the slot and subscribe
                    currentRoom[role] = ws.id;
                    ws.roomId = roomId; // Store for easy cleanup
                    ws.role = role;     // Store for easy cleanup

                    ws.subscribe(roomId);
                    console.log(`✅ ${ws.id} joined room ${roomId} as ${role}`);

                    // Optional: Notify the client of success
                    send(ws, { event: 'joined', roomId, role });
                    break;
                }

                // Mirrors: socket.on('control-command', ...) → relay to Android in room
                // Browser sends JSON text; Android receives JSON text – unchanged.
                case 'control-command': {
                    uwsApp.publish(data.roomId, JSON.stringify({ event: 'execute-command', ...data }));
                    break;
                }

                // Legacy JSON screen-frame path (kept for backward compatibility).
                // Android now sends binary frames; this branch handles any old clients
                // that still send base64 JSON.
                case 'screen-frame': {
                    uwsApp.publish(data.roomId, JSON.stringify({ event: 'screen-frame', ...data }));
                    break;
                }

                // Mirrors: socket.on('signal', data => io.to(data.roomId).emit('signal', data))
                case 'signal': {
                    uwsApp.publish(data.roomId, JSON.stringify({ event: 'signal', ...data }));
                    break;
                }

                // Android presence events – broadcast to room so browser knows device is online
                case 'android-online': {
                    const { roomId } = data;
                    console.log(`Android online in room ${roomId}`);
                    uwsApp.publish(roomId, JSON.stringify({ event: 'android-online', roomId }));
                    break;
                }

                default:
                    console.log('Unknown event:', event);
            }
        },

        // ── close ────────────────────────────────────────────────────────────
        close(ws, code, message) {
            console.log('🔥: A user disconnected:', ws.id);
        
            // Clean up room slots based on the stored role
            if (ws.roomId && ws.role && rooms.has(ws.roomId)) {
                const roomData = rooms.get(ws.roomId);
                
                // Clear the specific role slot
                if (roomData[ws.role] === ws.id) {
                    roomData[ws.role] = null;
                    console.log(`Slot ${ws.role} vacated in room ${ws.roomId}`);
                }
        
                // If both slots are null, delete the room entry to save memory
                if (!roomData['android-screen'] && !roomData['web-screen']) {
                    rooms.delete(ws.roomId);
                }
            }
        
            wsMap.delete(ws.id);
            if (ws.userId) {
                delete sockets[ws.userId];
            }
        },
    });

    uwsApp.listen(port, token => {
        token
            ? console.log(`✅ uWebSockets listening on port ${port}`)
            : console.error(`❌ Failed to listen on port ${port}`);
    });

    return uwsApp;
};

socketConnection();

// ─── Mirrors getSocketIo() ────────────────────────────────────────────────────
export const getSocketApp = () => uwsApp;

// ─── Mirrors getSocketUser(fn) ────────────────────────────────────────────────
export const getSocketUser = (fn) => {
    client.hgetall('mastersocket', (err, obj) => {
        if (err) throw err;
        console.log('REDIS', obj);
        fn(obj);
    });
};

// ─── Emit to a specific userId ────────────────────────────────────────────────
export const emitToUser = (userId, event, data) => {
    client.hget('mastersocket', userId, (err, socketId) => {
        if (err || !socketId) return;
        const ws = wsMap.get(socketId);
        if (ws) send(ws, { event, ...data });
    });
};

// ─── Broadcast to everyone ────────────────────────────────────────────────────
export const emitToAll = (event, data) => {
    if (uwsApp) uwsApp.publish('broadcast', JSON.stringify({ event, ...data }));
};