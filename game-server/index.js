import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from "cors"
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Adjust this in production to the specific client origin
    methods: ["GET", "POST"]
  }
});

app.use(cors())

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for events from clients
  socket.on('join_game', (data) => {
    console.log(`User joined game:`, data);
    // Emit a response or forward to other players in the game room
    socket.emit('game_joined', { message: "You've joined the game", data });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});
