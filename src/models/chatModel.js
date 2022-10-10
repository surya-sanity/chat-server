module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("chat", {
    messageId: {
      type: DataTypes.STRING,
    },
    fromUserId: {
      type: DataTypes.STRING,
    },
    toUserId: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
    sent: {
      type: DataTypes.BOOLEAN,
    },
    seen: {
      type: DataTypes.BOOLEAN,
    },
    dateSent: {
      type: DataTypes.STRING,
    },
    dateSeen: {
      type: DataTypes.STRING,
    },

  });

  return Chat;
};
