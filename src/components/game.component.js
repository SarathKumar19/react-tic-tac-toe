import React, { Component } from "react";
import Board from "./board.component";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          grid: Array(3).fill(Array(3).fill(null)),
          cellSelected: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isEndOfGame: false,
    };
  }

  handleOnClick(row, col) {
    if (this.state.isEndOfGame) {
      return;
    }
    if (this.state.stepNumber !== this.state.history.length - 1) {
      // Allow player to play only if he's on current move (not on traversing history of moves)
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
      history: history.concat([{ grid: grid, cellSelected: {'row': row, 'col': col} }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isEndOfGame: this.computeWinner(grid) || this.isEndOfGame(grid),
    });
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
        return {
          player: grid[cell1["row"]][cell1["col"]],
          combination: [cell1, cell2, cell3],
        };
      }
    }

    return this.isEndOfGame(grid) ? { player: "draw" } : null;
  }

  isEndOfGame(grid) {
    let isEndOfGame = true;
    for (let row of grid) {
      for (let cell of row) {
        if (!cell) {
          isEndOfGame = false;
        }
      }
    }
    return isEndOfGame;
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
    const winner = this.computeWinner(currentBoard.grid);
    const winningCombination =
      winner && winner.combination ? winner.combination : [];

    let status;
    if (winner) {
      if (winner.player === "draw") {
        status = "It's a draw!!!";
      } else {
        status = "Winner: " + winner.player;
      }
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      let desc = "Go to game start";
      if (move) {
        let {row, col} = step.cellSelected;
        desc = `Go to move #${move} at (${col}, ${row})`;
      }
      return (
        <li key={move}>
          <button className="moveHistoryButton" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            grid={currentBoard.grid}
            winningCombination={winningCombination}
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
