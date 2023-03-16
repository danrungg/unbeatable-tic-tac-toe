// Player factory
// assigment can be "X" or "O"
// Player should do: give Assigment to other
const Player = (assignment) => {
	const getPlayerAssigment = () => assignment;
	return { getPlayerAssigment };
};

const AiPlayer = (assigment) => {
	const prototype = Player(assigment);

	return Object.assign(prototype);
};

const HumanPlayer = (assigment) => {
	const prototype = Player(assigment);

	return Object.assign(prototype);
};

const GameBoard = (() => {
	const board = ["", "", "", "", "", "", "", "", ""];

	const getGameBoard = () => board;

	const resetGameBoard = () => {
		for (let i = 0; i < board.length; i += 1) {
			board[i] = "";
		}
	};

	return { getGameBoard, resetGameBoard };
})();
//////

const DisplayController = (() => {
	const updateGameBoard = () => {
		const array = GameBoard.getGameBoard();

		const writeToDOM = (selector) => {
			document.querySelectorAll(selector).forEach((e, i) => {
				e.innerText = array[i];
			});
		};
		writeToDOM(".grid-item");
	};

	const boardListener = (selector) => {
		document.querySelector(selector).addEventListener("click", (e) => {
			if (e.target.classList.contains("grid-item")) {
				if (GameBoard.getGameBoard()[e.target.id] === "") {
					GameController.playerOneRound(e.target.id);
					GameController.playerTwoRound();

					updateGameBoard();
				}
			}
		});
	};
	boardListener(".grid-container");
})();

//////

const GameController = (() => {
	const playerX = HumanPlayer("X");
	const playerO = AiPlayer("O");
	let roundNumber = 1;
	let gameOver = false;

	const setGameBoard = (index, assigment) => {
		GameBoard.getGameBoard()[index] = assigment;
	};

	const checkWin = () => {
		//
		//     |   |
		//   0 | 1 | 2
		// ----+---+----
		//   3 | 4 | 5
		// ----+---+----
		//   6 | 7 | 8
		//     |   |
		//

		const winningConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		const gameState = GameBoard.getGameBoard();
		let roundWon = false;
		for (let i = 0; i < 8; i += 1) {
			const winCondition = winningConditions[i];
			const a = gameState[winCondition[0]];
			const b = gameState[winCondition[1]];
			const c = gameState[winCondition[2]];

			if (a !== "" || b !== "" || c !== "") {
				if (a === b && b === c) {
					roundWon = true;
					break;
				}
			}
		}
		console.log(roundWon);
		return roundWon;
	};
	// MINIMAX
	////////
	function minimax(player, board) {
		const aiPlayer = player;
		const humanPlayer = player === "X" ? "O" : "X";

		const checkWin = (board, player) => {
			const winStates = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
				[0, 3, 6],
				[1, 4, 7],
				[2, 5, 8],
				[0, 4, 8],
				[2, 4, 6],
			];

			return winStates.some((state) =>
				state.every((index) => board[index] === player)
			);
		};

		const getAvailableMoves = (board) => {
			return board.reduce((moves, cell, index) => {
				if (cell === "") {
					moves.push(index);
				}
				return moves;
			}, []);
		};

		const evaluateBoard = (board, depth) => {
			if (checkWin(board, aiPlayer)) {
				return 10 - depth;
			} else if (checkWin(board, humanPlayer)) {
				return depth - 10;
			} else {
				return 0;
			}
		};

		const minimaxHelper = (board, player, depth) => {
			if (checkWin(board, aiPlayer)) {
				return evaluateBoard(board, depth);
			} else if (checkWin(board, humanPlayer)) {
				return evaluateBoard(board, depth);
			} else if (getAvailableMoves(board).length === 0) {
				return evaluateBoard(board, depth);
			}

			depth++;

			if (player === aiPlayer) {
				let bestScore = -Infinity;
				getAvailableMoves(board).forEach((move) => {
					let newBoard = [...board];
					newBoard[move] = aiPlayer;
					let score = minimaxHelper(newBoard, humanPlayer, depth);
					bestScore = Math.max(bestScore, score);
				});
				return bestScore;
			} else {
				let bestScore = Infinity;
				getAvailableMoves(board).forEach((move) => {
					let newBoard = [...board];
					newBoard[move] = humanPlayer;
					let score = minimaxHelper(newBoard, aiPlayer, depth);
					bestScore = Math.min(bestScore, score);
				});
				return bestScore;
			}
		};

		const getBestMove = (board, player) => {
			let bestScore = -Infinity;
			let bestMove;
			getAvailableMoves(board).forEach((move) => {
				let newBoard = [...board];
				newBoard[move] = player;
				let score = minimaxHelper(
					newBoard,
					player === "X" ? "O" : "X",
					0
				);
				if (score > bestScore) {
					bestScore = score;
					bestMove = move;
				}
			});
			return bestMove;
		};

		return getBestMove(board, player);
	}
	// END MINIMAX
	/////////

	const getCurrentPlayerAssigment = () => {
		if (roundNumber % 2 === 1) {
			return playerX.getPlayerAssigment();
		}
		if (roundNumber % 2 === 0) {
			return playerO.getPlayerAssigment();
		}
	};

	const playerOneRound = (index) => {
		// better: if human player
		if (getCurrentPlayerAssigment() === "X") {
			console.log(getCurrentPlayerAssigment());
			setGameBoard(index, getCurrentPlayerAssigment());
			checkWin();
			console.log(GameBoard.getGameBoard());
		}

		roundNumber++;
	};

	const playerTwoRound = () => {
		if (getCurrentPlayerAssigment() === "O") {
			let bestMove = minimax(
				getCurrentPlayerAssigment(),
				GameBoard.getGameBoard()
			);

			setGameBoard(bestMove, getCurrentPlayerAssigment());
			checkWin();
		}
		roundNumber++;
	};

	return { playerOneRound, playerTwoRound };
})();
