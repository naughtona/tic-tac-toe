import React from 'react';

import Board from './board';

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                xIsNext: true,
            }]
        };
    }

    handleClick(i) {
        const [curr] = this.state.history.slice(-1);
        const squares = [...curr.squares];
        if (isFinished(squares) || squares[i]) {
            return;
        }
		squares[i] = curr.xIsNext ? 'X' : 'O';
		this.setState({
            history: [
                ...this.state.history, 
                {
                    squares: squares,
                    xIsNext: !curr.xIsNext,
                }
            ], 
            
        });
	}

    jumpTo(move) {
        this.setState({history: this.state.history.slice(0, move+1)});
    }

	render() {
        const [curr] = this.state.history.slice(-1);
        const finished = isFinished(curr.squares);

        const moves = this.state.history.map((squares,move) => {
            const text = move > 0 ? `Go to move #${move}` : "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{text}</button>
                </li>
            );
        });
        let status;
        if (finished) {
            status = finished === "D" ? "It's a draw!" : `Winner: ${finished}`;
        } else {
            status = 'Next player: ' + (curr.xIsNext ? 'X' : 'O');
        }
		return (
			<div className="game">
				<div className="game-board">
					<Board 
                        squares={curr.squares}
                        onClick={(i) => this.handleClick(i)}
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

function isFinished(squares) {
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];
	for (let i = 0; i < lines.length; i++) {
		const candidate = squares.filter((d,j) => (lines[i]).includes(j));

        if (candidate[0] !== null && candidate.every((val, i, arr) => val === arr[0])) {
			return candidate[0];
		}
	}

	return squares.every((val, i, arr) => val !== null) ? "D" : null;
}