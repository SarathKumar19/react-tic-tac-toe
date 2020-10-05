import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  renderGridSquare(row, col) {
    const squareKey = `${row}${col}`;
    return (
      <Square
        key={squareKey}
        value={this.props.grid[row][col]}
        onClick={() => this.props.onClick(row, col)}
      ></Square>
    );
  }

  squaresInRow(row) {
    let rowKey = `row${row}`;
    let cols = [];
    for (var col = 0; col < this.props.grid[row].length; col++) {
      cols.push(this.renderGridSquare(row, col));
    }
    return (
      <div className="board-row" key={rowKey}>
        {cols}
      </div>
    );
  }

  render() {
    let rowContainers = [];
    for (var row = 0; row < this.props.grid.length; row++) {
      rowContainers.push(this.squaresInRow(row));
    }
    return <div>{rowContainers}</div>;
  }
}
class Game extends React.Component {
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
    if (
      this.state.winner &&
      (this.state.winner === "X" || this.state.winner === "O")
    ) {
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
      winner: computeWinner(grid),
    });
    console.log(this.state);
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
      status = "Winner: " + this.state.winner;
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
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function computeWinner(grid) {
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
}
