'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const EMPTY_CELL = 0

const TETROMINOS = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]]
]

const createEmptyBoard = () => Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))

export default function Tetris() {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [gameOver, setGameOver] = useState(false)

  const spawnNewPiece = useCallback(() => {
    const newPiece = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)]
    setCurrentPiece(newPiece)
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece[0].length / 2), y: 0 })
  }, [])

  const moveDown = useCallback(() => {
    if (!currentPiece) return
    if (isValidMove(currentPiece, position.x, position.y + 1)) {
      setPosition(prev => ({ ...prev, y: prev.y + 1 }))
    } else {
      placePiece()
      spawnNewPiece()
    }
  }, [currentPiece, position])

  const moveLeft = () => {
    if (currentPiece && isValidMove(currentPiece, position.x - 1, position.y)) {
      setPosition(prev => ({ ...prev, x: prev.x - 1 }))
    }
  }

  const moveRight = () => {
    if (currentPiece && isValidMove(currentPiece, position.x + 1, position.y)) {
      setPosition(prev => ({ ...prev, x: prev.x + 1 }))
    }
  }

  const rotate = () => {
    if (!currentPiece) return
    const rotated = currentPiece[0].map((_, index) => currentPiece.map(row => row[index]).reverse())
    if (isValidMove(rotated, position.x, position.y)) {
      setCurrentPiece(rotated)
    }
  }

  const isValidMove = (piece, x, y) => {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const newX = x + col
          const newY = y + row
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX])) {
            return false
          }
        }
      }
    }
    return true
  }

  const placePiece = () => {
    const newBoard = board.map(row => [...row])
    for (let row = 0; row < currentPiece.length; row++) {
      for (let col = 0; col < currentPiece[row].length; col++) {
        if (currentPiece[row][col]) {
          if (position.y + row < 0) {
            setGameOver(true)
            return
          }
          newBoard[position.y + row][position.x + col] = 1
        }
      }
    }
    setBoard(newBoard)
  }

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
    setPosition({ x: 0, y: 0 })
    setGameOver(false)
    spawnNewPiece()
  }

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece()
    }
  }, [currentPiece, gameOver, spawnNewPiece])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowDown':
          moveDown()
          break
        case 'ArrowUp':
          rotate()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver, moveDown])

  useEffect(() => {
    if (gameOver) return
    const gameLoop = setInterval(moveDown, 1000)
    return () => clearInterval(gameLoop)
  }, [gameOver, moveDown])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Tetris</h1>
      <div className="border-4 border-gray-700 bg-white p-2">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`w-6 h-6 border border-gray-300 ${cell || (currentPiece && currentPiece[rowIndex - position.y] && currentPiece[rowIndex - position.y][cellIndex - position.x]) ? 'bg-blue-500' : 'bg-white'}`}
              />
            ))}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-bold text-red-500 mb-2">¡Juego terminado!</p>
          <Button onClick={resetGame}>Reiniciar juego</Button>
        </div>
      )}
      <div className="mt-4 flex space-x-2">
        <Button onClick={moveLeft}>Izquierda</Button>
        <Button onClick={moveRight}>Derecha</Button>
        <Button onClick={rotate}>Rotar</Button>
        <Button onClick={moveDown}>Bajar</Button>
      </div>
    </div>
  )
}