import * as playerHandler from "./playerHandler.js";
import * as roomHandler from "./roomHandler.js";

export const requestHandler = (message, socket) => {
  const { type, data } = message;

  switch (type) {
    case "reg":
      playerHandler.handleRegistration(data, socket);
      break;

    case "create_room":
      roomHandler.createRoom(data, socket);
      break;

    case "add_user_to_room":
      roomHandler.addUserToRoom(data, socket);
      break;
  }
  roomHandler.updateRooms();
};
