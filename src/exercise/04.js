// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({selectSquare, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function makeId() {
  return Date.now()
}

function makeInitialMove() {
  return [
    {
      id: makeId(),
      value: Array(9).fill(null),
    },
  ]
}

function Game() {
  const [moves, setMoves] = useLocalStorageState('moves', makeInitialMove())

  const squares = moves[moves.length - 1].value
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner) return
    if (squares[square]) return

    const value = [...squares]
    value[square] = nextValue

    setMoves([
      ...moves,
      {
        id: makeId(),
        value,
      },
    ])
  }

  function restart() {
    setMoves(makeInitialMove())
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board selectSquare={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {moves.map((move, index) => {
            const isFirst = index === 0
            const isLast = index === moves.length - 1

            return (
              <li key={move.id}>
                <button disabled={isLast}>
                  Go to {isFirst ? 'game start' : `move #${index}`}
                  {isLast && ' (current)'}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
