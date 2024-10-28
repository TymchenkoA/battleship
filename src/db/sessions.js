class SessionsDatabase {
  constructor() {
    this.sessions = new Map();
  }

  addSession(socket, userId) {
    this.sessions.set(socket, userId);
  }

  getUserId(socket) {
    return this.sessions.get(socket) || null;
  }

  getSocketByUserId(userId) {
    for (const [socket, id] of this.sessions.entries()) {
      if (id === userId) {
        return socket;
      }
    }
    return null;
  }

  removeSession(socket) {
    this.sessions.delete(socket);
  }

  getAllSessions() {
    return Array.from(this.sessions.entries()).map(([socket, userId]) => ({
      socket,
      userId,
    }));
  }
}

export default new SessionsDatabase();
