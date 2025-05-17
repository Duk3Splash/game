import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/lobby_screen.css';

const LobbyScreen = ({ createGame, joinGame, gameId, isInGame }) => {
  const [gameIdInput, setGameIdInput] = useState('');
  const navigate = useNavigate();

  // Add an effect to monitor when isInGame or gameId changes
  useEffect(() => {
    if (isInGame) {
      navigate('/game');
    }
  }, [isInGame, gameId, navigate]);

  const handleCreateGame = () => {
    createGame();
    // We don't navigate here directly - we wait for isInGame to change
  };

  const handleJoinGame = () => {
    if (gameIdInput) {
      joinGame(gameIdInput);
      // We don't navigate here directly - we wait for isInGame to change
    }
  };

  return (
    <div className="lobby-container">
      <h1>Cricket Card Game</h1>
      <div className="lobby-card">
        <h2>Create or Join a Game</h2>
        
        {gameId && (
          <div className="game-id-display">
            <p>Your Game ID:</p>
            <div className="game-id-box">
              <span>{gameId}</span>
              <button 
                onClick={() => {navigator.clipboard.writeText(gameId)}}
                className="copy-button"
              >
                Copy
              </button>
            </div>
            <p className="instruction">Share this with your opponent</p>
          </div>
        )}
        
        <div className="button-group">
          <button 
            onClick={handleCreateGame}
            className="create-game-button"
          >
            Create New Game
          </button>
          
          <div className="join-game-section">
            <input 
              type="text"
              placeholder="Enter Game ID"
              value={gameIdInput}
              onChange={(e) => setGameIdInput(e.target.value)}
              className="game-id-input"
            />
            <button 
              onClick={handleJoinGame}
              className="join-game-button"
              disabled={!gameIdInput}
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;