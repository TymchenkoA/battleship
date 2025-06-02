import usersDB from './users.js';

class WinnersDatabase {
  constructor() {
    this.winners = {};
  }

  initializeUser(userId) {
    if (!this.winners[userId]) {
      this.winners[userId] = 0;
    }
  }

  addWin(userId) {
    this.initializeUser(userId);
    this.winners[userId] += 1;
  }

  getWinners() {
    return Object.entries(this.winners).map(([userId, wins]) => ({
      name: usersDB.getUserName(userId),
      wins,
    }));
  }
}

export default new WinnersDatabase();
