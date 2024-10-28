import gamesDB from "../db/games.js";
import sessionsDB from "../db/sessions.js";

export const addShips = (data, socket) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data);
  const game = gamesDB.addShipsToGame(gameId, ships, indexPlayer);

  if (game) {
    game.players.forEach((playerId) => {
      const playerSocket = sessionsDB.getSocketByUserId(playerId);
      if (playerSocket) {
        playerSocket.send(
          JSON.stringify({
            type: "start_game",
            data: JSON.stringify({
              ships: game.getShips(playerId),
              // currentPlayerIndex: playerId
              currentPlayerIndex: game.turn,
            }),
            id: 0,
          })
        );
      }
    });
  } else {
    socket.send(
      JSON.stringify({
        type: "add_ships",
        data: JSON.stringify({ status: "waiting" }),
        id: 0,
      })
    );
  }
};

export const processAttack = (data, userId, socket) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const game = gamesDB.findGameById(gameId);

  if (!game) {
    return socket.send(
      JSON.stringify({
        type: "attack",
        data: { error: true, errorText: "Game not found." },
        id: 0,
      })
    );
  }

  const attackResult = game.handleAttack(indexPlayer, x, y);

  game.players.forEach((playerId) => {
    const playerSocket = sessionsDB.getSocketByUserId(playerId);
    if (playerSocket) {
      playerSocket.send(
        JSON.stringify({
          type: "attack",
          data: {
            position: { x, y },
            currentPlayer: indexPlayer,
            status: attackResult.status,
          },
          id: 0,
        })
      );
    }
  });

  if (attackResult.status === "miss") {
    game.toggleTurn();
  }

  game.players.forEach((playerId) => {
    const playerSocket = sessionsDB.getSocketByUserId(playerId);
    if (playerSocket) {
      playerSocket.send(
        JSON.stringify({
          type: "turn",
          data: { currentPlayer: game.turn },
          id: 0,
        })
      );
    }
  });
};
