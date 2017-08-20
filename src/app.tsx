
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactBoostrap  from 'react-bootstrap';

import Comp from './app/components/comp';


function Square(props) 
{
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

interface BoardData
{
    xIsNext: boolean;
    squares?: string[];
}

class Board extends React.Component<any, BoardData> 
{
    constructor() 
    {
        super();
        this.state = 
        {
            xIsNext: true,
            squares: Array(9).fill(null),
        };
    }

    handleSquareClick(i:number) :void
    {
        const squares = this.state.squares.slice();

        if(squares[i] == null)
        {
            squares[i] = (this.state.xIsNext)?'X':'O';

            this.setState({squares: squares ,xIsNext:!this.state.xIsNext});
        }
    }

    getWinner():string 
    {
        const squares = this.state.squares.slice();
        
        const lines = 
        [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++)
        {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) 
            {
                return squares[a];
            }
        }
        return null;
    }

    renderSquare(i) 
    {
        return <Square 
                    value = {this.state.squares[i]} 
                    onClick = {()=>{this.handleSquareClick(i)}} 
                />;
    }

    render() 
    {
        let status:string = "";

        let winner = this.getWinner();

        if(winner != null)
        {
            status = 'Winner: '+winner;
        }
        else
        {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

class Game extends React.Component<any, any> 
{
  render() 
  {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================


ReactDOM.render(
    <div className="container-fluid">
    <button type="button" className="btn btn-success">Success</button>
    </div>
    ,
  document.getElementById('root')
);