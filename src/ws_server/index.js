import { WebSocketServer } from "ws";

export function startWsServer(wsServerPort) {
  const wsServer = new WebSocketServer({ port: wsServerPort });

  wsServer.on("connection", (socket) => {
    console.log("New WebSocket connection established");

    socket.on("message", (message) => {
      const receivedData = JSON.parse(message);
      console.log(receivedData);

      if (receivedData.type === "reg") {
        const { name, password } = JSON.parse(receivedData.data);
        console.log(
          `Received login data - Username: ${name}, Password: ${password}`
        );

        // socket.send(JSON.stringify({
        //   type: 'reg',
        //   data: {
        //     name: name,
        //     index: 1,
        //     error: false,
        //     errorText: ""
        //   },
        //   id: 0
        // }));
      }
    });

    socket.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
  
  console.log(`WebSocket server is running on ws://localhost:${wsServerPort}`);
}
