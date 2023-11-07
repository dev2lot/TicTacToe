const App = {
  $: {
    menu: document.querySelector("[data-id=menu-button]"),
    menuItems: document.querySelector("[data-id=menu-popover]"),
    reset: document.querySelector("[data-id=reset-btn]"),
    newRound: document.querySelector("[data-id=new-round-btn]"),
    squares: document.querySelectorAll("[data-id=squares]"),
    modal: document.querySelector("[data-id=modal]"),
    modalText: document.querySelector("[data-id=modal-text]"),
    modalBtn: document.querySelector("[data-id=modal-btn]"),
    turn: document.querySelector("[data-id=turn]"),
  },
  // Global Variables to track the game state
  state: {
    currentPlayer: 1,
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    // Fixed winningPatterns of TicTacToe
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1wins = pattern.every((v) => p1Moves.includes(v));
      const p2wins = pattern.every((v) => p2Moves.includes(v));

      if (p1wins) winner = 1;
      if (p2wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", //in-progress|complete
      winner: winner,
    };
  },

  init() {
    App.registerEventListner();
  },
  registerEventListner() {
    App.$.menu.addEventListener("click", (Event) => {
      App.$.menuItems.classList.toggle("hidden");
    });
    App.$.reset.addEventListener("click", (Event) => {
      console.log("Reseting the game.");
    });
    App.$.newRound.addEventListener("click", (Event) => {
      console.log("New round starting");
    });
    App.$.modalBtn.addEventListener("click", (Event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });

    // For click on a square updating the element inside that square element with an icon
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (Event) => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const icon = document.createElement("i");
        const turnIcon = document.createElement("i");

        const nextPlayer = getOppositePlayer(currentPlayer);
        const turnLable = document.createElement("p");
        turnLable.innerText = `Player ${nextPlayer} your'e up!`;

        // Check for Player for  X O variations
        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-xmark", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLable.classList = "turquoise";
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-xmark", "yellow");
          turnLable.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLable);

        App.state.currentPlayer = currentPlayer === 1 ? 2 : 1;

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(icon);

        const game = this.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");

          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = `Tie Game!`;
          }

          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", () => App.init());