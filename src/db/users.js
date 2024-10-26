import { randomUUID } from "node:crypto";

class UsersDatabase {
  constructor() {
    this.users = [];
  }

  registerUser(name, password) {
    const user = this.users.find((user) => user.name === name);

    if (user) {
      if (password !== user.password) {
        return {
          name,
          index: user.id,
          errorText: "Wrong password",
          error: true,
        };
      }

      return {
        user,
        error: false,
      };
    }

    const newUser = {
      id: randomUUID(),
      name,
      password,
    };

    this.users.push(newUser);

    return { error: false, user: newUser };
  }

  getAllUsers() {
    return this.users;
  }
}

export default new UsersDatabase();
