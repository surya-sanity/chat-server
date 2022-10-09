
function handleNewSocketConnection(socket, io) {

  socket.on("message", (message) => {
    switch (message.type) {
      case "TextMessage": {
        //create message in db;
        const toUserId = message.message.toUserId;
        io.sockets.in(toUserId).emit("message", message)
        break;
      }
      case "Typing": {
        const toUserId = message.message.toUserId;
        io.sockets.in(toUserId).emit("message", message)
        break;
      }
    }
  })

  socket.on("addUser", (message) => {
    const userId = message.message.userId;
    socket.join(userId);

    console.log("NEW USER JOINED ->", userId);
  })

  socket.on("disconnect", () => {
    console.info("USER DISCONNECTED ->", socket.id)
  })
}

module.exports = { handleNewSocketConnection }