import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

// Tạo một Socket.IO server gắn vào server
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

//  lấy socketId tương ứng với một userId
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//lưu thông tin người dùng online
const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('A user conntected:', socket.id);

    // Lấy userId mà client gửi khi kết nối
    const userId = socket.handshake.query.userId;
    // giúp server biết ai đang online và đang dùng socket nào
    if (userId) userSocketMap[userId] = socket.id;

    // Gửi danh sách userId đang online cho tất cả các client đang kết nối
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
})

export { io, app, server }