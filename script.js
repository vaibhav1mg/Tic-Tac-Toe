const Player = (name, token) => {
  return { name, token };
};

function GameBoard(initialSize = 3) {
  let size = parseInt(localStorage.getItem("boardSize")) || initialSize;
  let board = Array.from({ length: size }, () => Array(size).fill(null));

  const addMark = (row, col, mark) => {
    if (board[row][col] !== null) {
      console.log("Invalid Move, Please try Another move");
      return false;
    }
    board[row][col] = mark;
    return true;
  };

  const resetBoard = () =>
    (board = Array.from({ length: size }, () => Array(size).fill(null)));

  const printBoard = () => {
    const boardWithValues = board.map((row) => row.join(" ")).join("\n");
    console.log(boardWithValues);
  };

  const checkWin = () => {
    const checkLines = (line) => {
      return (
        line.every((cell) => cell === 1) || line.every((cell) => cell === -1)
      );
    };
    for (let i = 0; i < size; i++) {
      if (checkLines(board[i])) return board[i][0];
      if (checkLines(board.map((row) => row[i]))) return board[0][i];
    }
    const mainDiagonal = board.map((row, index) => row[index]);
    const antiDiagonal = board.map((row, index) => row[size - index - 1]);

    if (checkLines(antiDiagonal)) return board[0][size - 1];
    if (checkLines(mainDiagonal)) return board[0][0];

    if (board.every((row) => row.every((cell) => cell !== null))) {
      return "draw";
    }

    return null;
  };

  const getBoard = () => board;
  const getSize = () => size;
  const setSize = (newSize) => {
    size = newSize;
    localStorage.setItem("boardSize", size);
    resetBoard();
  };

  return {
    resetBoard,
    addMark,
    getBoard,
    checkWin,
    printBoard,
    getSize,
    setSize,
  };
}

function GameController(
  PlayerOneName = "Player 1",
  PlayerTwoName = "Player 2"
) {
  const board = GameBoard();

  const players = [Player(PlayerOneName, 1), Player(PlayerTwoName, -1)];

  let activePlayer = players[0];

  const switchPlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const getActivePlayer = () => activePlayer;
  const resultElement = document.getElementById("result");
  const playRound = (row, column) => {
    console.log(
      `${getActivePlayer().name}'s places Marker at ${row} , ${column} ... `
    );
    if (board.addMark(row, column, getActivePlayer().token)) {
      board.printBoard();
      const result = board.checkWin();
      if (result) {
        if (result === "draw") {
          resultElement.textContent = "it's a draw";
          console.log("it's a draw");
        } else {
          resultElement.textContent = `${
            getActivePlayer().name
          } won the game 🎉`;
          // console.log(`${getActivePlayer().name} won the game`);
        }
        openResultModal();

        board.printBoard();
        return;
      }
      switchPlayer();
      console.log(`${getActivePlayer().name}'s Turn now`);
    }
  };

  const getGameBoard = () => board;
  const resetBoard = () => board.resetBoard();

  return { playRound, resetBoard, getActivePlayer, getGameBoard };
}

function Modal(modal) {
  const overlay = document.querySelector(".overlay");

  const addModal = () => {
    modal.classList.add("active");
    overlay.classList.add("active");
  };

  const removeModal = () => {
    overlay.classList.remove("active");
    modal.classList.remove("active");
  };

  return { addModal, removeModal };
}

function openResultModal() {
  const modal = document.querySelector(".modal");
  const runmodal = Modal(modal);
  const resetBtn = document.querySelector("#resetBtn");

  runmodal.addModal();

  resetBtn.addEventListener("click", function () {
    game.resetBoard();
    updateGrid.updateGrid();
    runmodal.removeModal();
  });
}

function newGameModal() {
  const modal = document.querySelector("#newGame_modal");
  const runmodal = Modal(modal);
  const startBtn = document.querySelector("#startBtn");

  document.getElementById("playerName1").value =
    localStorage.getItem("playerOneName") || "";

  document.getElementById("playerName2").value =
    localStorage.getItem("playerTwoName") || "";

  runmodal.addModal();

  startBtn.addEventListener("click", function () {
    game.resetBoard();
    updateGrid.updateGrid();
    runmodal.removeModal();

    const playerOneName = document.getElementById("playerName1").value;
    const playerTwoName = document.getElementById("playerName2").value;

    localStorage.setItem("playerOneName", playerOneName);
    localStorage.setItem("playerTwoName", playerTwoName);

    document.getElementById("PlayerOneName").innerText =
      playerOneName === "" ? "Player 1" : playerOneName;
    document.getElementById("PlayerTwoName").innerText =
      playerTwoName === "" ? "Player 2" : playerTwoName;
  });
}

function UpdateGridFn(game) {
  const container = document.getElementById("grid");

  const updateGrid = (i, j) => {
    if (i !== undefined) game.playRound(i, j);
    container.innerHTML = "";
    createCells();
  };

  const createCells = () => {
    const board = game.getGameBoard().getBoard();
    const size = game.getGameBoard().getSize();

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cell = document.createElement("div");
        cell.classList.add("game-cell");
        cell.addEventListener("click", () => updateGrid(i, j));
        let marker = board[i][j];
        cell.textContent = marker ? (marker === 1 ? "❌" : "⭕️") : " ";
        container.appendChild(cell);
      }
    }
    addCellStyles(size);
  };

  return { container, updateGrid };
}

const game = GameController();
const updateGrid = UpdateGridFn(game);

const newGameBtn = document.querySelector("#newGameBtn");
newGameBtn.addEventListener("click", newGameModal);

const resetBtn2 = document.querySelector("#resetBtn2");
resetBtn2.addEventListener("click", () => {
  game.resetBoard();
  updateGrid.updateGrid();
});

const slider = document.getElementById("sliderSize");
slider.setAttribute("value", `${game.getGameBoard().getSize()}`);
slider.addEventListener("input", function () {
  const sliderValue = parseInt(slider.value);
  game.getGameBoard().setSize(sliderValue);
  updateGrid.updateGrid();
});

document.getElementById("PlayerOneName").innerText =
  localStorage.getItem("playerOneName") || "Player 1";
document.getElementById("PlayerTwoName").innerHTML =
  localStorage.getItem("playerTwoName") || "Player 2";
// game.playRound(1, 0);
// game.playRound(2, 2);
// game.playRound(1, 1);
// game.playRound(2, 1);

updateGrid.updateGrid();

function addCellStyles(size) {
  document
    .getElementById("grid")
    .style.setProperty("grid-template-columns", `repeat(${size}, 1fr)`);
  topCells = document
    .querySelectorAll(`.game-cell:nth-child(-n+${size})`)
    .forEach((cell) => {
      cell.style.borderTop = "none";
    });

  rightCells = document
    .querySelectorAll(`.game-cell:nth-child(${size}n)`)
    .forEach((cell) => {
      cell.style.borderRight = "none";
    });

  bottomCells = document
    .querySelectorAll(`.game-cell:nth-last-child(-n+${size})`)
    .forEach((cell) => {
      cell.style.borderBottom = "none";
    });

  leftCells = document
    .querySelectorAll(`.game-cell:nth-child(${size}n+1)`)
    .forEach((cell) => {
      cell.style.borderLeft = "none";
    });
}
