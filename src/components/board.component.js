import React, { Component } from "react";

const Square = (props) => {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

class Board extends Component {
  renderGridSquare(row, col) {
    let squareClassName = "square";
    for (let combination of this.props.winningCombination) {
      if (combination.row === row && combination.col === col) {
        squareClassName = "selectedSquare";
      }
    }
    const squareKey = `${row}${col}`;
    return (
      <Square
        key={squareKey}
        className={squareClassName}
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

export default Board;
