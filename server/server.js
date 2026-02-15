const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

//scoket.io setup
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.set("io", io);

connectDB();

app.use(express.json());


// roustes
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const voteRoutes = require("./routes/voteRoutes");
const cors = require("cors");

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

app.use(cors({
  origin: "*",
}));

// socket
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("joinPoll", (pollId) => {
    
    socket.join(pollId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});



const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
