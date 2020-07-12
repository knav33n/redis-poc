const io = require("socket.io")(9090);
const redis = require("redis");
const client = redis.createClient();

io.on("connection", (socket) => {
  socket.on("hello", ({ hashID }) => {
    socket.join(hashID);
    client.incr(hashID, (err, count) => {
      io.to(hashID).emit("stats", count);
    });
  });
  console.log("Client Connected");
});
