
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {ipcRenderer} from 'electron'; 

import Toolbar from './app/ui/components/toolbar';
import UIManager from './app/core/uiManager';

class ApplicationWindow extends React.Component<any, any> 
{
    constructor()
    {
        super();

        this.state = 
        {
            name:"Zoser Default",
        };

        ipcRenderer.on('data',(event:any,data:any)=>this.dataReceived(event,data));
    }

    public dataReceived(event:any,data:any):void
    {
        console.log(data.name);

        this.setState({name:data.name});
    }

    render() 
    {
        return <Toolbar name={this.state.name}/>;
    }
}


function Square(props:any) 
{
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}


class Board extends React.Component<any, any> 
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

    renderSquare(i:number) 
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

UIManager.initialize();

ReactDOM.render(
    <ApplicationWindow/>
    ,document.getElementById('root')
);