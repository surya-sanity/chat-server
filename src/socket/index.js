const db = require("../models");

const Chat = db.chats;

let onlineUsers = new Set();


const createChat = async (message) => {

  try {
    await Chat.create({
      messageId: message.message.messageId,
      fromUserId: message.message.fromUserId,
      toUserId: message.message.toUserId,
      text: message.message.text,
      sent: message.sent ?? true,
      seen: message.seen ?? false,
      dateSent: message.dateSent ?? new Date().toISOString(),
    }).then((createdMessage) => {
      return createdMessage;
    });

  } catch (e) {
    console.error("create err", e)
  }
  return;
}

const updateChatSeen = async (messageId) => {

  try {
    const messageFound = await Chat.findOne({ where: { messageId: messageId } })
    if (!messageFound) {
      console.log("Message not found");
      return;
    }

    await Chat.update({ seen: true, dateSeen: new Date().toISOString() }, { where: { messageId: messageId } });
  } catch (e) {
    console.log("seen update err", e)
  }
  return;
}


function handleNewSocketConnection(socket, io) {

  socket.on("message", async (message) => {
    switch (message.type) {
      case "TextMessage": {
        const toUserId = message.message.toUserId;
        const fromUserId = message.message.fromUserId;
        message.message.sent = true
        await createChat(message);
        io.sockets.in(fromUserId).emit("message", message)
        io.sockets.in(toUserId).emit("message", message)
        break;
      }
      case "Typing": {
        const toUserId = message.message.toUserId;
        io.sockets.in(toUserId).emit("message", message)
        break;
      }
      case "UpdateSeen": {
        const toUserId = message.message.toUserId;
        const fromUserId = message.message.fromUserId;
        await updateChatSeen(message.message.messageId)
        io.sockets.in(fromUserId).emit("message", message)
        io.sockets.in(toUserId).emit("message", message)
        break;
      }
      case "GetOnlineStatus": {
        const userId = message.message.userId;
        const fromUserId = message.message.fromUserId;

        message.type = "UserOnlineStatus";
        message.message.isOnline = onlineUsers.has(userId);
        io.sockets.in(fromUserId).emit("message", message)
        break;
      }
    }
  })

  const broadCastUserStatus = (userId) => {
    const message = {
      type: "UserOnlineStatus",
      message: {
        isOnline: onlineUsers.has(userId) ?? false,
        userId: (userId),
      }
    };

    socket.broadcast.emit("message", message);
  }

  socket.on("addUser", (message) => {
    const userId = message.message.userId;
    socket.join(userId);
    onlineUsers.add(userId)
    broadCastUserStatus(userId)
    console.log("User connected", socket.id)

  })

  socket.on("disconnecting", () => {
    const [, second] = socket.rooms;
    if (second) {
      onlineUsers.delete(second)
      broadCastUserStatus(second)
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
  })
}

const sentProfileUpdateBroadCast = () => {
  const message = {
    type: "ProfileUpdate",
    message: true
  }
  io.emit("message", message)
}


module.exports = { handleNewSocketConnection, sentProfileUpdateBroadCast }