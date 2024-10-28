class Game {
  constructor(roomId, players) {
  
    this.id = roomId;
    this.players = players;
    this.ships = {};
    this.readyPlayers = new Set();
    this.turn = players[0];
    this.status = "awaiting_ships";
  }

  addShips(playerId, ships) {
    this.ships[playerId] = ships;
    this.readyPlayers.add(playerId);

    if (this.readyPlayers.size === 2) {
      this.status = "in_progress";
      return true;
    }
    return false;
  }

  getShips(playerId) {
    return this.ships[playerId] || [];
  }

  handleAttack(playerId, x, y) {
    if (this.turn !== playerId) {
      return { error: true, errorText: "Not your turn." };
    }

    const opponentId = this.players.find(p => p !== playerId);
    const opponentShips = this.ships[opponentId];
    const result = this.checkAttack(opponentShips, x, y);

    return { status: result };
  }

  checkAttack(opponentShips, x, y) {
    console.log(opponentShips);
    let targetShip = null;
    let partHitIndex = null;

    opponentShips.forEach((ship, index) => {
      const shipPositions = this.getShipCoordinates(ship);
      shipPositions.forEach((pos, posIndex) => {
        if (pos.x === x && pos.y === y && !pos.hit) {
          targetShip = ship;
          partHitIndex = posIndex;
        }
      });
    });

    if (!targetShip) {
      return 'miss';
    }

    const hitPart = this.getShipCoordinates(targetShip)[partHitIndex];
    hitPart.hit = true;

    const isSunk = this.getShipCoordinates(targetShip).every(part => part.hit);

    if (isSunk) {
      targetShip.sunk = true;
      return 'killed';
    }

    return 'shot'; 
  }

  getShipCoordinates(ship) {
    const { position, direction, length } = ship;
    const coordinates = [];

    for (let i = 0; i < length; i++) {
      coordinates.push({
        x: direction ? position.x : position.x + i,
        y: direction ? position.y + i : position.y,
        hit: false,
      });
    }

    return coordinates;
  }


  markSurroundingCellsAsMissed(opponentShips, x, y) {
    const killedShip = opponentShips.find(ship =>
      this.getShipCoordinates(ship).some(part => part.x === x && part.y === y && ship.sunk)
    );

    if (!killedShip) return;

    const killedShipCoordinates = this.getShipCoordinates(killedShip);

    const gridSize = 10;

    killedShipCoordinates.forEach(part => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const newX = part.x + dx;
          const newY = part.y + dy;

          if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {

            if (!opponentShips.some(ship => 
              this.getShipCoordinates(ship).some(p => p.x === newX && p.y === newY)
            )) {

              this.markCellAsMissed(newX, newY);
            }
          }
        }
      }
    });
  }

  markCellAsMissed(x, y) {
    if (!this.missedCells) {
      this.missedCells = [];
    }
    this.missedCells.push({ x, y });
  }

  toggleTurn() {
    this.turn = this.players.find(p => p !== this.turn);
  }
}

class GamesDatabase {
  constructor() {
    this.games = [];
  }

  createGame(roomId, players) {
    const game = new Game(roomId, players);
    this.games.push(game);
    return game;
  }

  findGameById(gameId) {
    const game = this.games.find((game) => game.id === gameId);
    return game;
  }

  addShipsToGame(gameId, ships, indexPlayer) {
    const game = this.findGameById(gameId);
    if (!game) return null;

    const gameReadyToStart = game.addShips(indexPlayer, ships);
    return gameReadyToStart ? game : null;
  }
}

export default new GamesDatabase();
