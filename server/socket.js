const socketIO = require("socket.io");

let io;

const initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("join_group", (groupId) => {
            socket.join(groupId);
            console.log(`Client ${socket.id} joined group ${groupId}`);
        });

        socket.on("leave_group", (groupId) => {
            socket.leave(groupId);
            console.log(`Client ${socket.id} left group ${groupId}`);
        });

        socket.on("join_user_room", (userId) => {
            socket.join(userId);
            console.log(`Client ${socket.id} joined user room ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };
