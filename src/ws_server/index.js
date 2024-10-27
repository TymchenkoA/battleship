import { WebSocketServer } from "ws";
import { requestHandler } from "../handlers/requestHandler.js";

export function startWsServer(wsServerPort) {
  const wsServer = new WebSocketServer({ port: wsServerPort });

  wsServer.on("connection", (socket) => {
    console.log("New WebSocket connection established");

    socket.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        requestHandler(parsedMessage, socket);
      } catch (error) {
        console.error("Failed to parse message:", error);
        socket.send(JSON.stringify({ error: "Invalid message format" }));
      }
    });

    socket.on("message", (message) => {
      requestHandler(message);
    });

    socket.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  console.log(`WebSocket server is running on ws://localhost:${wsServerPort}`);
}
