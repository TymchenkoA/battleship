import * as playerHandler from './playerHandler.js';
import * as roomHandler from './roomHandler.js';

export const requestHandler = (message, socket) => {
  const { type, data } = message;

  switch (type) {
    case 'reg':
      playerHandler.handleRegistration(data, socket);
      break;

    case 'create_room':
    case 'add_user_to_room':
      roomHandler.handleRoomRequest(type, data, socket);
      break;

  }
}
