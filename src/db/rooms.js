import { randomUUID } from "node:crypto";

class Room {
  constructor(hostPlayerId) {
    this.roomId = randomUUID();
    this.roomUsers = [hostPlayerId];
    this.isAvailable = true;
  }

  addPlayer(playerId) {
    if (this.roomUsers.length >= 2) return false;
    if (this.roomUsers.indexOf(playerId) !== -1) return false;
    this.roomUsers.push(playerId);
    this.isAvailable = this.roomUsers.length < 2;
    return true;
  }
}

class RoomsDatabase {
  constructor() {
    this.rooms = [];
  }

  createRoom(playerId) {
    const room = new Room(playerId);
    this.rooms.push(room);
    return room;
  }

  findRoomById(roomId) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    return room;
  }

  addPlayerToRoom(roomId, playerId) {
    const room = this.findRoomById(roomId);
    return room ? room.addPlayer(playerId) : false;
  }

  getAvailableRooms() {
    return this.rooms;
  }

  deleteRoom(roomId) {
    const updatedRooms = this.rooms.filter(room => room.roomId !== roomId);
    this.rooms = updatedRooms;
  }
}

export default new RoomsDatabase();
