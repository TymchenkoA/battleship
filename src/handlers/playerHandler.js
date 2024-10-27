import usersDB from "../db/users.js";

export const handleRegistration = (data, socket) => {
  const { name, password } = JSON.parse(data);

  if (!name || !password) {
    socket.send(
      JSON.stringify({
        originalCommand: { type: "reg", data: JSON.parse(data) },
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
        originalCommand: { type: "reg", data: JSON.parse(data) },
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
        originalCommand: { type: "reg", data: JSON.parse(data) },
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
};
