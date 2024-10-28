import { wsServer } from "../ws_server/index.js";

export const broadcastToAll = (message) => {
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
