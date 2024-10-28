import roomsDB from "../db/rooms.js";
import usersDB from "../db/users.js";
import sessionsDB from "../db/sessions.js";
import { broadcastToAll } from "../utils/broadcast.js";

export const createRoom = (data, socket) => {
  const userId = sessionsDB.getUserId(socket);

  roomsDB.createRoom(userId);
};

export const addUserToRoom = (data, socket) => {
  const userId = sessionsDB.getUserId(socket);
  const { indexRoom } = JSON.parse(data);
  const room = roomsDB.findRoomById(indexRoom);

  if (!room || room.roomUsers.length >= 2) {
    return socket.send(
      JSON.stringify({
        type: "add_user_to_room",
        data: JSON.stringify({
          error: true,
          errorText: "Room is full or doesn't exist",
        }),
        id: 0,
      })
    );
  }

  roomsDB.addPlayerToRoom(indexRoom, userId);

  socket.send(
    JSON.stringify({
      type: "create_game",
      data: JSON.stringify({ idGame: indexRoom, idPlayer: userId }),
      id: 0,
    })
  );
};

export const updateRooms = () => {
  const rooms = roomsDB.getAvailableRooms();

  const data = rooms.map((room) => {
    const roomInfo = {
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((playerId) => ({
        name: usersDB.getUserName(playerId),
        index: playerId,
      })),
    };
    return roomInfo;
  });

  broadcastToAll({
    type: "update_room",
    data: JSON.stringify(data),
    id: 0,
  });
};
