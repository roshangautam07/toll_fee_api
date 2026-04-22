import uWS from './uWebSockets.js-20.30.0/uws.js';
import client from './config/redis.js';
import { v4 as uuidv4 } from 'uuid';

const decoder = new TextDecoder('utf-8');

// ─── State ────────────────────────────────────────────────────────────────────
let uwsApp;                      // uWS app instance (set in socketConnection)
let sockets   = {};              // userId  → socketId   (mirrors old sockets{})
let wsMap     = new Map();       // socketId → ws object (needed to send to a specific socket)
let rooms     = new Map();       // roomId   → Set<socketId>

// ─── Helpers ──────────────────────────────────────────────────────────────────
const send = (ws, obj) => {
    try { ws.send(JSON.stringify(obj)); } catch (_) { /* socket already gone */ }
};

const publish = (app, topic, obj) => {
    app.publish(topic, JSON.stringify(obj));
};

// ─── Redis-backed Socket → userId map (mirrors old socketRedis / getSocketUser) ─
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

// ─── Main export (mirrors socketConnection) ───────────────────────────────────
export const socketConnection = (port = 3000) => {
    uwsApp = uWS.App();

    uwsApp.ws('/ws', {
        compression:      uWS.SHARED_COMPRESSOR,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout:      60,

        // ── open ────────────────────────────────────────────────────────────
        open(ws) {
            ws.id = uuidv4();
            wsMap.set(ws.id, ws);

            console.log(`⚡: ${ws.id} user just connected!`);

            // Subscribe to broadcast topics
            ws.subscribe('broadcast');
            ws.subscribe(ws.id);          // private channel
        },

        // ── message ─────────────────────────────────────────────────────────
        message(ws, rawMsg, isBinary) {
            let data;
            try {
                data = JSON.parse(decoder.decode(rawMsg));
            } catch {
                console.error('Bad JSON from', ws.id);
                return;
            }

            const { event } = data;

            switch (event) {

                // Mirrors: socket.on('connected', userId => { ... })
                case 'connected': {
                    const { userId } = data;
                    console.log('IDS', userId);
                    sockets[userId] = ws.id;
                    ws.userId = userId;
                    saveSocketMap(userId, ws.id);
                    console.log('UserIddd', userId);
                    console.log('socks', sockets);
                    break;
                }

                // Mirrors: socket.on('success', data => socket.broadcast.emit('login', data))
                case 'success': {
                    console.log('tttttttttttttttttttfyj', data.username);
                    // broadcast to everyone except sender
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
                    // loggers.error('Billing error', { ...data }); // uncomment if loggers is available
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
                    const { roomId } = data;
                    ws.subscribe(roomId);
                    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
                    rooms.get(roomId).add(ws.id);
                    console.log(`${ws.id} joined room ${roomId}`);
                    break;
                }

                // Mirrors: socket.on('control-command', data => io.to(data.roomId).emit('execute-command', data))
                case 'control-command': {
                    uwsApp.publish(data.roomId, JSON.stringify({ event: 'execute-command', ...data }));
                    break;
                }

                // Mirrors: socket.on('screen-frame', data => io.to(data.roomId).emit('screen-frame', data))
                case 'screen-frame': {
                    uwsApp.publish(data.roomId, JSON.stringify({ event: 'screen-frame', ...data }));
                    break;
                }

                // Mirrors: socket.on('signal', data => io.to(data.roomId).emit('signal', data))
                case 'signal': {
                    uwsApp.publish(data.roomId, JSON.stringify({ event: 'signal', ...data }));
                    break;
                }

                default:
                    console.log('Unknown event:', event);
            }
        },

        // ── close ────────────────────────────────────────────────────────────
        close(ws, code, message) {
            console.log('🔥: A user disconnected:', ws.id);

            // Clean up room membership
            rooms.forEach((members, roomId) => {
                members.delete(ws.id);
                if (members.size === 0) rooms.delete(roomId);
            });

            // Clean up socket maps
            wsMap.delete(ws.id);
            if (ws.userId) {
                delete sockets[ws.userId];
                removeSocketMap(ws.userId);
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

// ─── Emit to a specific userId (helper that replaces io.to(socketId).emit()) ──
export const emitToUser = (userId, event, data) => {
    client.hget('mastersocket', userId, (err, socketId) => {
        if (err || !socketId) return;
        const ws = wsMap.get(socketId);
        if (ws) send(ws, { event, ...data });
    });
};

// ─── Broadcast to everyone (replaces io.emit()) ───────────────────────────────
export const emitToAll = (event, data) => {
    if (uwsApp) uwsApp.publish('broadcast', JSON.stringify({ event, ...data }));
};