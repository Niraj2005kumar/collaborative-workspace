const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🟢 Client Connected: ${socket.id}`);

    socket.on("joinWorkspace", (workspaceId) => {
      if (!workspaceId) return;

      socket.join(`workspace:${workspaceId}`);

      console.log(`📁 ${socket.id} joined Workspace: ${workspaceId}`);
    });

    socket.on("leaveWorkspace", (workspaceId) => {
      if (!workspaceId) return;

      socket.leave(`workspace:${workspaceId}`);

      console.log(`🚪 ${socket.id} left Workspace: ${workspaceId}`);
    });

    socket.on("joinBoard", (boardId) => {
      if (!boardId) return;

      socket.join(`board:${boardId}`);

      console.log(`📋 ${socket.id} joined Board: ${boardId}`);
    });

    socket.on("leaveBoard", (boardId) => {
      if (!boardId) return;

      socket.leave(`board:${boardId}`);

      console.log(`🚪 ${socket.id} left Board: ${boardId}`);
    });

    socket.on("joinList", (listId) => {
      if (!listId) return;

      socket.join(`list:${listId}`);

      console.log(`📝 ${socket.id} joined List: ${listId}`);
    });

    socket.on("leaveList", (listId) => {
      if (!listId) return;

      socket.leave(`list:${listId}`);

      console.log(`🚪 ${socket.id} left List: ${listId}`);
    });

    socket.on("joinCard", (cardId) => {
      if (!cardId) return;

      socket.join(`card:${cardId}`);

      console.log(`💬 ${socket.id} joined Card: ${cardId}`);
    });

    socket.on("leaveCard", (cardId) => {
      if (!cardId) return;

      socket.leave(`card:${cardId}`);

      console.log(`🚪 ${socket.id} left Card: ${cardId}`);
    });

    socket.on("workspaceUpdated", (workspaceId, data) => {
      socket.to(`workspace:${workspaceId}`).emit("workspaceUpdated", data);
    });

    socket.on("boardUpdated", (boardId, data) => {
      socket.to(`board:${boardId}`).emit("boardUpdated", data);
    });

    socket.on("cardCreated", (listId, card) => {
      socket.to(`list:${listId}`).emit("cardCreated", card);
    });

    socket.on("cardUpdated", (listId, card) => {
      socket.to(`list:${listId}`).emit("cardUpdated", card);
    });

    socket.on("cardDeleted", (listId, cardId) => {
      socket.to(`list:${listId}`).emit("cardDeleted", cardId);
    });

    socket.on("cardPositionsUpdated", (listId, cards) => {
      socket.to(`list:${listId}`).emit("cardPositionsUpdated", cards);
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔴 Client Disconnected: ${socket.id} (${reason})`);
    });

    socket.on("error", (error) => {
      console.error(`❌ Socket Error (${socket.id}):`, error);
    });
  });
};

module.exports = setupSocket;