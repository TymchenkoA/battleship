import { WebSocketServer } from "ws";
import usersDB from "../db/users.js";

export function startWsServer(wsServerPort) {
  const wsServer = new WebSocketServer({ port: wsServerPort });

  wsServer.on("connection", (socket) => {
    console.log("New WebSocket connection established");

    socket.on("message", (message) => {
      const receivedData = JSON.parse(message);

      if (receivedData.type === "reg") {
        const { name, password } = JSON.parse(receivedData.data);

        if (!name || !password) {
          socket.send(
            JSON.stringify({
              type: "reg",
              data: JSON.stringify({
                name: "",
                index: null,
                error: true,
                errorText: "Name and password are required",
              }),
              id: 0,
            })
          );

          return;
        }

        const registrationResult = usersDB.registerUser(name, password);

        if (registrationResult.error) {
          socket.send(
            JSON.stringify({
              type: "reg",
              data: JSON.stringify({
                name,
                index: registrationResult.index || null,
                error: true,
                errorText: registrationResult.errorText,
              }),
              id: 0,
            })
          );
        } else {
          const newUser = registrationResult.user;

          console.log(newUser);
          socket.send(
            JSON.stringify({
              type: "reg",
              data: JSON.stringify({
                name: newUser.name,
                index: newUser.id,
                error: false,
                errorText: "",
              }),
              id: 0,
            })
          );
        }
      }
    });

    socket.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  console.log(`WebSocket server is running on ws://localhost:${wsServerPort}`);
}
