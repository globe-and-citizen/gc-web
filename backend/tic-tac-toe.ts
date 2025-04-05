const { v4: uuidv4 } = require('uuid');

// Game state
let games = new Map();
let playerConnections = new Map();

// This is a two dimensional array, having the: | playerId | score |
let leaderBoard: any[] = [];
// This is an object array, having {host, guest, gameId}
let gameLobby: any[] = [];
let gameLogs: any[] = [];


export const onWsConn = (ws: WebSocket, wss: any) => {
    console.log('New client connected');
    let gameId_: any = null;
    let playerId_: any = null;

    ws.addEventListener('message', (message: MessageEvent) => {
        try {
            // we must have this here to ping the reverse proxy that we need the tunnel established, health_check
            if (message.data == "health_check" || message.data == "init_tunnel") {
                ws.send(message.data)
                return
            }

            const data = JSON.parse(message.data);
            switch (data.type) {
                case 'CREATE_GAME':
                    handleCreateGame(ws, data.name);
                    break;

                case 'JOIN_GAME':
                    handleJoinGame(ws, data.name, data.gameId);
                    break;

                case 'MOVE_MADE':
                    handleMakeMove(ws, data.name, data.position);
                    break;

                case 'RESET_GAME':
                    handleResetGame(ws, data.gameId, data.name);
                    break;

                case "LEADERBOARD":
                    orderByScore();
                    ws.send(JSON.stringify({
                        type: "LEADERBOARD",
                        leaderBoard,
                        gameLogs
                    }));
                    break;

                case "GAME_LOBBY":
                    ws.send(JSON.stringify({
                        type: "GAME_LOBBY",
                        gameLobby
                    }))
                    break;

                case "GAME_REF":
                    gameRef(data.playerId);
                    break;

                case "GAME_CHAT":
                    console.log('received game chat broadcast request');
                    gameChat(data.gameId, data.sender, data.text);
                    break;

                case "END_GAME":
                    console.log('received end game request');
                    handlePlayerDisconnect(data.playerId, data.gameId);
                    break;

                default:
                    console.log('Unknown message type:', data.type);
                    console.log('Message data:', data);
                    console.log('Message unparsed:', message);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.addEventListener('close', () => {
        handlePlayerDisconnect(playerId_, gameId_);
        playerConnections.delete(playerId_);
        console.log('Client disconnected');
    });

    // Handler functions
    function handleCreateGame(ws: WebSocket, name: string) {
        // if there's already an active connection with this player id refuse with error
        if (playerConnections.get(name))
            games.forEach((game, key) => {
                if (game.players.includes(name)) {
                    return ws.send(JSON.stringify({
                        type: 'ERROR',
                        message: `The player with id: "${name}" already exists and is currently playing a game`
                    }));
                }
            });

        // Generate unique IDs
        gameId_ = uuidv4();
        playerId_ = name;

        // Create a new game
        games.set(gameId_, {
            board: Array(9).fill(null),
            players: [playerId_],
            currentTurn: playerId_,
            gameOver: false,
            winner: null
        });

        // Store connection info
        playerConnections.set(playerId_, {
            ws,
            gameId: gameId_,
            symbol: 'X'
        });

        // Send game created confirmation
        orderByScore();
        ws.send(JSON.stringify({
            type: 'GAME_CREATED',
            gameId: gameId_,
            playerId: playerId_,
            symbol: 'X',
            isYourTurn: true
        }));

        gameLobby.push({
            host: playerId_,
            gameId: gameId_
        });

        broadcastLobby();
    }

    function gameChat(gameId: any, sender: any, text: any) {
        const game = games.get(gameId);
        if (!game)
            return ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Game not found'
            }));

        // Notify both players of the chat
        game.players.forEach((pid: any) => {
            const connection = playerConnections.get(pid);
            if (connection && connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify({
                    type: 'GAME_CHAT',
                    gameId,
                    sender,
                    text
                }));
            }
        });
    }

    function handleJoinGame(ws: WebSocket, name: any, requestedGameId: any) {
        // Check if game exists and can be joined
        const game = games.get(requestedGameId);

        if (!game)
            return ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Game not found'
            }));


        if (game.players.length >= 2)
            return ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Game is full'
            }));

        if (playerConnections.get(name))
            games.forEach((game, key) => {
                if (game.players.includes(name)) {
                    return ws.send(JSON.stringify({
                        type: 'ERROR',
                        message: `The player with id: "${name}" already exists and is currently playing a game`
                    }));
                }
            });

        // Join the game
        gameId_ = requestedGameId;
        playerId_ = name;
        game.players.push(playerId_);

        // Store connection info
        playerConnections.set(playerId_, {
            ws,
            gameId: gameId_,
            symbol: 'O'
        });


        // Notify first player that opponent has joined
        const opponentId = game.players[0];
        const opponentConnection = playerConnections.get(opponentId);

        // Send game joined confirmation
        orderByScore();
        ws.send(JSON.stringify({
            type: 'GAME_JOINED',
            gameId: gameId_,
            playerId: playerId_,
            symbol: 'O',
            isYourTurn: false,
            board: game.board,
            opponentId
        }));

        if (opponentConnection && opponentConnection.ws.readyState === WebSocket.OPEN) {
            opponentConnection.ws.send(JSON.stringify({
                type: 'OPPONENT_JOINED',
                opponentId: playerId_
            }));
        }

        // update the game lobby
        for (let idx in gameLobby) {
            if (gameLobby[idx].gameId == gameId_) {
                gameLobby.splice(Number(idx), 1);
                broadcastLobby();
                break;
            }
        }
    }

    function gameRef(playerId: any) {
        games.forEach((game, key) => {
            if (game.players.includes(playerId)) {
                let playerInfo = playerConnections.get(playerId);
                playerConnections.set(playerId, {
                    ws,
                    gameId: key,
                    symbol: playerInfo.symbol
                });

                gameId_ = key;
                playerId_ = playerId;

                ws.send(JSON.stringify({
                    type: "GAME_REF",
                    gameId: key,
                    board: game.board,
                    isYourTurn: !game.gameOver && game.currentTurn === playerId,
                    gameOver: game.gameOver,
                    winner: game.winner,
                    symbol: playerInfo.symbol,
                    opponentId: game.players.find((id: any) => id !== playerId)
                }));
            }
        });
    }

    function handleMakeMove(ws: WebSocket, playerId: any, position: any) {
        if (!gameId_ || !playerId) return;

        const game = games.get(gameId_);
        if (!game) return;

        // Check if it's player's turn and position is valid
        if (game.currentTurn !== playerId ||
            game.gameOver ||
            position < 0 ||
            position > 8 ||
            game.board[position] !== null) {
            return;
        }

        const playerInfo = playerConnections.get(playerId);

        // Update game board
        game.board[position] = playerInfo.symbol;

        // Check for win or draw
        const { winner, gameOver } = checkGameStatus(game.board);
        game.winner = winner;
        game.gameOver = gameOver;

        const otherPlayerId = game.players.find((id: any) => id !== playerId);
        if (playerInfo.symbol === winner)
            givePointsToPlayer(playerId, otherPlayerId);

        // Switch turns if game is not over
        if (!gameOver)
            game.currentTurn = otherPlayerId;

        // Notify both players of the move
        game.players.forEach((pid: any) => {
            const connection = playerConnections.get(pid);
            if (connection && connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify({
                    type: 'MOVE_MADE',
                    position,
                    symbol: playerInfo.symbol,
                    board: game.board,
                    isYourTurn: !gameOver && game.currentTurn === pid,
                    gameOver,
                    winner: game.winner,
                    opponentId: game.players.find((id: any) => id !== pid)
                }));
            }
        });
    }

    function handleResetGame(_: WebSocket, gameId: any, playerId: any) {
        if (!gameId || !playerId) return;

        const game = games.get(gameId);
        if (!game) return;

        // Reset the game
        game.board = Array(9).fill(null);
        game.gameOver = false;
        game.winner = null;

        // Determine who goes first (alternate from the previous game)
        const firstPlayerId = game.players[0];
        const secondPlayerId = game.players[1];

        // If X went first last time, O goes first this time
        if (game.currentTurn == firstPlayerId) {
            game.currentTurn = secondPlayerId;
        } else {
            game.currentTurn = firstPlayerId;
        }

        // Notify both players of the reset
        game.players.forEach((pid: any) => {
            const connection = playerConnections.get(pid);
            if (connection && connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify({
                    type: 'RESET_GAME',
                    board: game.board,
                    isYourTurn: game.currentTurn == pid,
                    opponentId: game.players.find((id: any) => id != pid)
                }));
            }
        });
    }

    function handlePlayerDisconnect(pid: any, gid: any) {
        if (!pid || !gid) return;

        // Get the game
        const game = games.get(gid);
        if (!game) return;

        // Notify remaining player
        const remainingPlayerId = game.players.find((id: any) => id !== pid);
        if (remainingPlayerId) {
            // lets give a point to the remaining player if not already won
            if (game.winner == null) {
                givePointsToPlayer(remainingPlayerId, pid);
            }

            const connection = playerConnections.get(remainingPlayerId);
            if (connection && connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify({
                    type: 'OPPONENT_DISCONNECTED'
                }));
            }
        }

        // remove game from lobby
        for (let idx in gameLobby) {
            if (gameLobby[idx].gameId == gid) {
                gameLobby.splice(Number(idx), 1);
                broadcastLobby();
                break;
            }
        }

        console.log('deleting game')
        games.delete(gid);
    }

    function orderByScore() {
        leaderBoard.sort((a, b) => b[1] - a[1])
    }

    function givePointsToPlayer(playerId: any, opponentId: any) {
        gameLogs.unshift(`${playerId} won against ${opponentId} at ${new Date().toString()}`)

        let updated = false;
        for (let i in leaderBoard) {
            // ["name", 5]
            if (leaderBoard[i][0] === playerId.trim()) {
                leaderBoard[i][1] += 1;
                updated = true;
                break;
            }
        }

        // entry was not present in leaderBoard
        if (!updated)
            leaderBoard.push([playerId, 1]);
    }

    function broadcastLobby() {
        wss.clients.forEach(function each(client: WebSocket) {
            client.send(JSON.stringify({
                type: "GAME_LOBBY",
                gameLobby
            }))
        })
    }
}

// Helper function to check for win or draw
function checkGameStatus(board: [number | null]): { winner: number | null, gameOver: boolean } {
    // Win patterns: rows, columns, diagonals
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Check for winner
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Return the symbol of the winner
            return { winner: board[a], gameOver: true };
        }
    }

    // Check for draw
    if (board.every(cell => cell !== null)) {
        return { winner: null, gameOver: true };
    }

    // Game is still in progress
    return { winner: null, gameOver: false };
}
