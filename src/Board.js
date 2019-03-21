import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {

  static defaultProps = {
    nrows: 5,
    ncols: 5
  }

  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      hasWon: false
    }
  }

  /** creates a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    for (let j = 0; j < this.props.nrows; j++){
      let row = [];
      for (let i = 0; i < this.props.ncols; i++){
        let light = Math.random() <= 0.5 ? true : false
        row.push(light);
      }
      board.push(row);
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);
    let hasWon = this.state.hasWon;

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // Flips clicked cell and cardinal direction neighbors
    // Janky: needs refactoring when we're clever.

    flipCell(y, x);
    flipCell((y + 1), x);
    flipCell((y -1), x);
    flipCell(y, (x + 1));
    flipCell(y, (x - 1));

    // win when every cell is turned off

    board.flat().includes(true) ? hasWon = false : hasWon = true;

    this.setState({board, hasWon});
  }


  /** Render game board or winning message. */

  render() {

    // if the game is won, just show a winning msg & render nothing else

    if (this.state.hasWon){
      return <div><p>"you won!"</p></div>
    } else {
      
      // loop over each col
      // let board = this.state.board
      // const rows = (() => {
      //   return board.map((r, i) => {
      //     return r.map((c, j) => {
      //       return <Cell isLit={this.state.board[i][j]}/>
      //     })
      //   })
      // })

      let tblBoard = [];
      let board = this.state.board
      for (var i = 0; i < board.length; i++){
        let row = [];
        for (var j = 0; j < board[i].length; j++){
          let coord = `${i}-${j}`;
          row.push(<Cell key={ coord } isLit={ board[i][j] } flipCellsAroundMe={ () => this.flipCellsAround(coord) }/>);
        }
        tblBoard.push(<tr key={ i }>{ row }</tr>)
      }

      return (
          <table className="Board">
            <tbody>{ tblBoard }</tbody>
          </table>
      );
    }

    // make table board

    // TODO

    // Pass flipCellsAround to Cell as flipCellsAroundMe.
  }
}


export default Board;
