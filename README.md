# RSSchool NodeJS websocket task 

### Prerequisites
1. Install [Node.js](https://nodejs.org/en/download/)   
2. Fork this repository: https://github.com/TymchenkoA/battleship
4. Go to folder `battleship`  
5. To install all dependencies use [`npm install`](https://docs.npmjs.com/cli/install)  
6. Start your project `npm run start`


* App served @ `http://localhost:8181`

---

## General project description
This is battleship game with backend that uses websocket.

The backend is be able to do the following:

Start websocket server
Handle websocket connection
Handle player requests
Handle room requests
Handle ships requests
Handle game requests

### The backend should have 3 types of response:

1. personal response
    reg - player registration/login
2. response for the game room
    create_game - game id and player id (unique id for user in this game)
    start_game - informationa about game and player's ships positions
    turn - who is shooting now
    attack - coordinates of shot and status
    finish - id of the winner
3. response for all
    update_room - list of rooms and players in rooms
    update_winners - send score table to players
