import winnersDB from "../db/winners.js";
import { broadcastToAll } from "../utils/broadcast.js";

export const updateWinners = () => {
  const winners = winnersDB.getWinners();

  broadcastToAll({
    type: "update_winners",
    data: JSON.stringify(winners),
    id: 0,
  });
};
