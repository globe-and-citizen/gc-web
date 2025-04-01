<template>
    <div class="tic-tac-toe border-b-2 border-black">
        <div class="container px-5 py-12 mx-auto">
            <div class="flex flex-col text-center w-full">
                <h2 class="text-5xl font-bold">Tic Tac Toe Showcase</h2>
            </div>
        </div>

        <div v-if="playerId">
            Currently playing as: <strong>{{ playerId }}</strong>
        </div>

        <div v-if="!connected" class="connecting">Connecting to server...</div>

        <!-- if playerId does not exist we need to "register" this player -->
        <div v-else-if="!playerId || !playerRegistered" class="join-form">
            <input v-model="playerId" placeholder="Enter Username (if you've played before use previous)"
                class="game-id-input" />
            <button @click="registerPlayer" class="btn">Register</button>
            <button :disabled="!playerId" @click="
                playerRegistered = false;
            playerId = '';
            " class="btn btn-secondary">
                Cancel
            </button>
        </div>

        <div v-else-if="!gameId" class="menu">
            <!-- We need a lobby area instead of copying game ids to inputs -->
            <div v-if="gameLobby.length" class="lobby">
                <h2>Game Lobby</h2>
                <ul>
                    <li v-for="(game, index) in gameLobby" :key="index">
                        <div v-if="game.host == playerId" class="rejoin-game">
                            <span>Rejoin game you created</span>
                            <button @click="gameId = game.gameId" class="btn">Rejoin</button>
                        </div>

                        <div v-else class="join-game">
                            <span>{{ game.host }} is looking to play</span>
                            <button @click="joinGame(game.gameId)" class="btn">Join</button>
                        </div>
                    </li>
                </ul>
            </div>
            <button @click="
                playerId = '';
            playerRegistered = false;
            " class="btn">
                Change PlayerId
            </button>
            <button @click="createGame" class="btn">Create New Game</button>
        </div>

        <div v-else>
            <div class="game-info">
                <div v-if="gameId && !opponentId">
                    <p>Waiting for an opponent to pick you in the lobby...</p>
                </div>

                <div v-else-if="gameOver">
                    <p v-if="winner === playerSymbol">
                        You won against <strong>{{ opponentId }}</strong>!
                    </p>
                    <p v-else-if="winner !== ''">
                        You lost against <strong>{{ opponentId }}</strong> !
                    </p>
                    <p v-else>It's a draw!</p>
                    <button @click="resetGame" class="btn">Play Again</button>
                </div>

                <div v-else>
                    <p>
                        You are playing as <strong>{{ playerSymbol }} </strong> against
                        <strong> {{ opponentId }}</strong>
                    </p>
                    <p v-if="isYourTurn">Your turn</p>
                    <p v-else>Opponent's turn</p>
                </div>
            </div>

            <div class="board">
                <div v-for="(cell, index) in board" :key="index" class="cell"
                    :class="{ clickable: isYourTurn && !cell && !gameOver }" @click="makeMove(index)">
                    <span v-if="cell === 'X'" class="x">X</span>
                    <span v-else-if="cell === 'O'" class="o">O</span>
                </div>
            </div>
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <div v-if="gameId" class="end-game-option">
            <button @click="endGame" class="btn btn-secondary">End Game</button>
        </div>

        <!-- chat with opponent section -->
        <div v-if="opponentId" class="chat">
            <h2>Chat with Opponent</h2>
            <div v-if="chatMessages.length" class="chat-window">
                <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
                    <span><strong>{{ message.sender }}:</strong> {{ message.text }}</span>
                </div>
            </div>
            <input v-model="chatInput" @keydown.enter="sendMessage" placeholder="Type a message..."
                class="chat-input" />
            <button @click="sendMessage" class="btn">Send</button>
        </div>

        <!-- leaderBoard -->
        <div v-if="leaderBoard.length" class="leaderboard">
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Player Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(player, idx) in leaderBoard" :key="idx">
                        <td>{{ idx + 1 }}</td>
                        <td>{{ player[0] }}</td>
                        <td>{{ player[1] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- game logs -->
        <div v-if="gameLogs.length" class="gameLogs">
            <h2>Game Logs</h2>
            <ul v-for="(log, idx) in gameLogs" :key="idx">
                <li>{{ log }}</li>
            </ul>
        </div>

        <div class="rules">
            <h2>Game Rules</h2>
            <ol>
                <li>Each player takes turns to place their symbol (X or O) on the board.</li>
                <li>The first player to align three of their symbols horizontally, vertically, or diagonally wins.</li>
                <li>If all nine cells are filled without a winner, the game is declared a draw.</li>
                <li>Winning a game awards 1 point.</li>
                <li>Drawing or losing a game results in no points.</li>
            </ol>
        </div>
    </div>
</template>

<script lang="ts">
import { L8WebSocket } from "layer8-interceptor-rs";
import { defineComponent } from "vue";
import { useCookies } from "@vueuse/integrations/useCookies";

// under .env file
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LAYER8_URL = import.meta.env.VITE_PROXY_URL;


console.log("typeof L8WebSocket: ", typeof L8WebSocket);

export default defineComponent({
    setup() {
        const cookies = useCookies(["player"]);
        return {
            cookies,
        };
    },

    data() {
        return {
            connected: false,
            socket: new L8WebSocket(),
            gameId: '',
            playerId: '',
            opponentId: '',
            playerSymbol: '',
            opponent: false,
            board: Array(9).fill(''),
            leaderBoard: [],
            isYourTurn: false,
            gameOver: false,
            winner: '',
            error: '',
            playerRegistered: false,
            gameLobby: [] as { gameId: string, host: string }[],
            gameLogs: [],
            chatMessages: [] as { sender: string, text: string }[],
            chatInput: ''
        };
    },
    async mounted() {
        await this.connectToServer();
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    },
    methods: {
        async connectToServer() {
            try {
                await this.socket.init({
                    url: BACKEND_URL,
                    proxy: LAYER8_URL,
                });

                // checking the playerId
                let player = this.cookies.get("player");
                if (player) {
                    this.playerRegistered = true;
                    this.error = '';
                    this.playerId = player;

                    // get game refs
                    this.socket.send(
                        JSON.stringify({
                            type: "GAME_REF",
                            playerId: this.playerId,
                        })
                    );

                    // fetching the game lobby
                    this.socket.send(
                        JSON.stringify({
                            type: "GAME_LOBBY",
                        })
                    );
                }

                this.connected = true;
            } catch (error) {
                this.connected = false;
                console.error(error);
            }

            this.socket.onmessage = (event: MessageEvent) => {
                this.handleMessage(JSON.parse(event.data));
            };

            this.socket.onclose = () => {
                this.connected = false;
                console.log("Disconnected from server");
                setTimeout(async () => await this.connectToServer(), 3000);
            };

            this.socket.onerror = (error: Event) => {
                console.error("WebSocket error:", error);
                this.error = "Connection error. Please try again.";
            };

            // fetching the leaderboard
            this.socket.send(
                JSON.stringify({
                    type: "LEADERBOARD",
                })
            );
        },

        handleMessage(message: any) {
            switch (message.type) {
                case "GAME_CREATED":
                    this.gameId = message.gameId;
                    this.playerId = message.playerId;
                    this.playerSymbol = message.symbol;
                    this.isYourTurn = message.isYourTurn;
                    break;

                case "GAME_JOINED":
                    this.gameId = message.gameId;
                    this.playerId = message.playerId;
                    this.playerSymbol = message.symbol;
                    this.isYourTurn = message.isYourTurn;
                    this.board = message.board;
                    this.opponent = true;
                    this.opponentId = message.opponentId;
                    break;

                case "OPPONENT_JOINED":
                    this.opponent = true;
                    this.opponentId = message.opponentId;
                    break;

                case "MOVE_MADE":
                    this.board = message.board;
                    this.isYourTurn = message.isYourTurn;
                    this.gameOver = message.gameOver;
                    this.winner = message.winner;
                    this.opponentId = message.opponentId;

                    // update the leaderboard
                    this.socket.send(
                        JSON.stringify({
                            type: "LEADERBOARD",
                        })
                    );

                    break;

                case "RESET_GAME":
                    this.board = message.board;
                    this.isYourTurn = message.isYourTurn;
                    this.gameOver = false;
                    this.winner = '';
                    this.opponentId = message.opponentId;

                    // update the leaderboard
                    this.socket.send(
                        JSON.stringify({
                            type: "LEADERBOARD",
                        })
                    );

                    break;

                case "OPPONENT_DISCONNECTED":
                    this.error = "Your opponent disconnected. You've won, game over!";
                    if (this.winner !== '')
                        this.error = "Your opponent disconnected!";
                    this.opponent = false;

                    // update the leaderboard
                    this.socket.send(
                        JSON.stringify({
                            type: "LEADERBOARD",
                        })
                    );

                    break;

                case "LEADERBOARD":
                    this.leaderBoard = message.leaderBoard;
                    this.gameLogs = message.gameLogs;
                    break;

                case "GAME_LOBBY":
                    this.gameLobby = message.gameLobby;
                    break;

                case "GAME_CHAT":
                    this.chatMessages.push({
                        sender: message.sender,
                        text: message.text,
                    });
                    break;

                case "GAME_REF":
                    this.gameId = message.gameId;
                    this.board = message.board;
                    this.isYourTurn = message.isYourTurn;
                    this.gameOver = message.gameOver;
                    this.winner = message.winner;
                    this.opponentId = message.opponentId;
                    this.playerSymbol = message.symbol;
                    this.opponent = message.opponentId !== '' || message.opponentId !== undefined;
                    break;

                case "ERROR":
                    this.error = message.message;
                    setTimeout(() => {
                        this.error = '';
                    }, 3000);
                    break;

                default:
                    console.log("Unknown message type:", message.type);
            }
        },

        createGame() {
            this.error = '';
            this.chatMessages = [];
            this.socket.send(
                JSON.stringify({
                    type: "CREATE_GAME",
                    name: this.playerId,
                })
            );
        },

        joinGame(gameIdInput: string) {
            if (!gameIdInput.trim()) {
                this.error = "Please enter a Game ID";
                return;
            }

            this.error = '';
            this.chatMessages = [];
            this.socket.send(
                JSON.stringify({
                    type: "JOIN_GAME",
                    gameId: gameIdInput.trim(),
                    name: this.playerId.trim(),
                })
            );
        },

        registerPlayer() {
            // we need to set this playerId to the cookie for resuse on other sessions
            if (!this.playerId.trim()) {
                this.error = "Please enter a Username";
                return;
            }

            var date = new Date();
            date.setDate(date.getDate() + 7);
            this.cookies.set('player', this.playerId, { expires: date });

            this.playerRegistered = true;
            this.error = '';

            // get game refs
            this.socket.send(
                JSON.stringify({
                    type: "GAME_REF",
                    playerId: this.playerId,
                })
            );

            // fetching the game lobby
            this.socket.send(
                JSON.stringify({
                    type: "GAME_LOBBY",
                })
            );
        },

        makeMove(position: number) {
            if (
                !this.isYourTurn ||
                this.board[position] ||
                this.gameOver ||
                !this.opponent
            ) {
                return;
            }

            this.board.splice(position, 1, this.playerSymbol);
            this.isYourTurn = false;

            if (this.checkWin(this.playerSymbol)) {
                this.gameOver = true;
                this.winner = this.playerSymbol;
            } else if (this.board.every((cell) => cell)) {
                this.gameOver = true;
                this.winner = '';
            }

            this.socket.send(
                JSON.stringify({
                    type: "MOVE_MADE",
                    position,
                    board: this.board,
                    gameOver: this.gameOver,
                    winner: this.winner,
                    name: this.playerId,
                    gameId: this.gameId,
                })
            );
        },

        checkWin(symbol: string) {
            const winningCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];

            return winningCombinations.some((combination) =>
                combination.every((index) => this.board[index] === symbol)
            );
        },

        resetGame() {
            this.socket?.send(
                JSON.stringify({
                    type: "RESET_GAME",
                    name: this.playerId,
                    gameId: this.gameId,
                })
            );
        },

        sendMessage() {
            if (!this.chatInput?.trim()) {
                this.error = "Please provide a message";
                return;
            }

            let message = this.chatInput;
            this.chatInput = '';
            this.socket?.send(
                JSON.stringify({
                    type: "GAME_CHAT",
                    gameId: this.gameId,
                    sender: this.playerId,
                    text: message,
                })
            );
        },

        endGame() {
            this.socket?.send(
                JSON.stringify({
                    type: "END_GAME",
                    playerId: this.playerId,
                    gameId: this.gameId,
                })
            );

            this.gameId = '';
            this.opponentId = '';
            this.opponent = false;
            this.error = '';

            // fetching the leaderboard
            this.socket.send(
                JSON.stringify({
                    type: "LEADERBOARD",
                })
            );

            // fetching the game lobby
            this.socket.send(
                JSON.stringify({
                    type: "GAME_LOBBY",
                })
            );
        },
    },
});
</script>

<style scoped>
.tic-tac-toe {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    font-family: Arial, sans-serif;
}

h1 {
    color: #333;
}

.menu,
.join-form {
    margin: 30px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.btn {
    padding: 12px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #45a049;
}

.btn-secondary {
    background-color: #f44336;
}

.btn-secondary:hover {
    background-color: #d32f2f;
}

.game-id-input {
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    margin: 30px auto;
    max-width: 300px;
}

.cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    height: 90px;
    font-size: 36px;
    font-weight: bold;
    cursor: default;
}

.clickable {
    cursor: pointer;
    background-color: #e8f5e9;
}

.clickable:hover {
    background-color: #c8e6c9;
}

.x {
    color: #f44336;
}

.o {
    color: #2196f3;
}

.game-info {
    margin: 20px 0;
}

.error {
    color: #f44336;
    margin: 15px 0;
}

.connecting {
    margin: 50px 0;
    font-style: italic;
}

.leaderboard {
    margin: 30px 0;
    text-align: left;
}

.leaderboard table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard th,
.leaderboard td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
}

.leaderboard th {
    background-color: #4caf50;
    color: white;
    font-weight: bold;
}

.leaderboard tr:nth-child(even) {
    background-color: #f9f9f9;
}

.leaderboard tr:hover {
    background-color: #e8f5e9;
}

.lobby {
    margin: 30px 0;
    text-align: left;
}

.lobby h2 {
    color: #333;
    margin-bottom: 20px;
}

.lobby ul {
    list-style-type: none;
    padding: 0;
}

.lobby li {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #f5f5f5;
}

.lobby li:hover {
    background-color: #e8f5e9;
}

.lobby .btn {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.lobby .btn:hover {
    background-color: #45a049;
}

.lobby .rejoin-game,
.lobby .join-game {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.gameLogs {
    margin: 30px 0;
    text-align: left;
}

.gameLogs ul {
    list-style-type: none;
    padding: 0;
}

.gameLogs li {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #f5f5f5;
}

.gameLogs li:hover {
    background-color: #e8f5e9;
}

.chat {
    margin: 30px 0;
    text-align: left;
}

.chat h2 {
    color: #333;
    margin-bottom: 20px;
}

.chat-window {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    max-height: 200px;
    overflow-y: auto;
    background-color: #f5f5f5;
    margin-bottom: 20px;
}

.chat-message {
    margin-bottom: 10px;
}

.chat-input {
    width: calc(100% - 90px);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
}

.chat .btn {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.chat .btn:hover {
    background-color: #45a049;
}

.chat-input,
.chat .btn {
    margin-bottom: 10px;
}

.rules {
    margin: 30px 0;
    text-align: left;
}
</style>