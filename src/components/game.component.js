import React, { Component } from "react";
import Board from "./board.component";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          grid: Array(3).fill(Array(3).fill(null)),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      winner: null,
    };
  }

  handleOnClick(row, col) {
    if (this.state.winner) {
      return;
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentBoard = history[history.length - 1];
    const grid = currentBoard.grid.map((row) => {
      return row.slice();
    });

    if (grid[row][col]) {
      return;
    }

    grid[row][col] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ grid: grid }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winner: this.computeWinner(grid),
    });
    console.log(this.state);
  }

  computeWinner(grid) {
    const winningCombinations = [
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      [
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ],
      [
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ],
      [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
      ],
      [
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 1 },
      ],
      [
        { row: 0, col: 2 },
        { row: 1, col: 2 },
        { row: 2, col: 2 },
      ],
      [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ],
      [
        { row: 0, col: 2 },
        { row: 1, col: 1 },
        { row: 2, col: 0 },
      ],
    ];

    for (let [cell1, cell2, cell3] of winningCombinations) {
      if (
        grid[cell1["row"]][cell1["col"]] &&
        grid[cell1["row"]][cell1["col"]] === grid[cell2["row"]][cell2["col"]] &&
        grid[cell1["row"]][cell1["col"]] === grid[cell3["row"]][cell3["col"]]
      ) {
        return grid[cell1["row"]][cell1["col"]];
      }
    }

    let isEndOfGame = true;
    for (let row of grid) {
      for (let cell of row) {
        if (!cell) {
          isEndOfGame = false;
        }
      }
    }
    return isEndOfGame ? "draw" : null;
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const currentBoard = history[this.state.stepNumber];

    let status;
    if (this.state.winner) {
      if (this.state.winner === "draw") {
        status = "It's a draw!!!";
      } else {
        status = "Winner: " + this.state.winner;
      }
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            grid={currentBoard.grid}
            onClick={(row, col) => this.handleOnClick(row, col)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

export default Game;
