import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardSelection from './card_selection';
import AttributeSelection from './attribute_selection';
import OpponentCard from './opponent_card';
import '../css/game_screen.css';

const GameScreen = ({ gameState, selectCard, selectAttribute, selectSpecialMode}) => {
  const navigate = useNavigate();
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Redirect if not in a game
  useEffect(() => {
    if (!gameState.isInGame) {
      navigate('/');
    }
  }, [gameState.isInGame, navigate]);

  useEffect(() => {
    console.log("GameScreen state updated:", {
      playerHasCard: !!gameState.selectedCard,
      opponentHasCard: !!gameState.opponentSelectedCard,
      turn: gameState.turn,
      playerId: gameState.playerId,
      isMyTurn: gameState.turn === gameState.playerId,
    });

    console.log('duk3 gameState', gameState);
  }, [gameState]);

  // Function to handle mode selection from dropdown
  const handleModeSelect = (modeId) => {
    // Call the selectSpecialMode function passed via props
    if (typeof selectSpecialMode === 'function') {
      selectSpecialMode(modeId);
    }
    setShowModeDropdown(false);
  };
  
  // Function to toggle dropdown visibility
  const toggleModeDropdown = () => {
    setShowModeDropdown(!showModeDropdown);
  };

  const renderHeader = () => {
    const isMyTurn = gameState.turn === gameState.playerId;

    return (
      <div className="game-header">
        <h1>Cricket Card Game</h1>
        
        <div className="game-health">
          <div className="health-item">
            <span className="health-label">You:</span>
            <span className="health-value">{typeof gameState.health.player === 'number' ? gameState.health.player.toFixed(1) : gameState.health.player}</span>
          </div>
          <div className="health-divider">-</div>
          <div className="health-item">
            <span className="health-label">Opponent:</span>
            <span className="health-value">{typeof gameState.health.opponent === 'number' ? gameState.health.opponent.toFixed(1) : gameState.health.opponent}</span>
          </div>
        </div>
        
        <div className="mode-and-round">
          <div className="round-info">
            <span>Round: {gameState.roundsPlayed + 1} of {gameState.totalRounds}</span>
          </div>
          
          {(isMyTurn && gameState.showModeSelection )? <div className="mode-dropdown-container">
            <button 
              className="mode-dropdown-toggle"
              onClick={toggleModeDropdown}
              disabled={gameState.availableModes.length === 0}
            >
              {gameState.activeMode ? (
                <>
                  <span className="active-mode-icon">
                    {gameState.activeMode === 'free_hit' && '🏏'}
                    {gameState.activeMode === 'super' && '⚡'}
                    {gameState.activeMode === 'power_play' && '🔄'}
                    {gameState.activeMode === 'world_cup' && '🏆'}
                  </span>
                  {gameState.activeMode}
                </>
              ) : (
                <>🎮 Special Mode</>
              )}
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showModeDropdown && gameState.availableModes.length > 0 && (
              <div className="mode-dropdown">
                <div className="dropdown-header">Select Special Mode</div>
                {gameState.availableModes.map(mode => (
                  <div 
                    key={mode} 
                    className="dropdown-item" 
                    onClick={() => handleModeSelect(mode)}
                  >
                    {mode === 'free_hit' && <><span className="mode-icon">🏏</span> Free Hit Mode</>}
                    {mode === 'super' && <><span className="mode-icon">⚡</span> Super Mode</>}
                    {mode === 'power_play' && <><span className="mode-icon">🔄</span> Power Play Mode</>}
                    {mode === 'world_cup' && <><span className="mode-icon">🏆</span> World Cup Mode</>}
                  </div>
                ))}
                <div className="dropdown-footer">
                  <button 
                    className="dropdown-cancel"
                    onClick={() => setShowModeDropdown(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {showModeDropdown && gameState.availableModes.length === 0 && (
              <div className="mode-dropdown">
                <div className="dropdown-message">
                  All special modes have been used
                </div>
                <div className="dropdown-footer">
                  <button 
                    className="dropdown-cancel"
                    onClick={() => setShowModeDropdown(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div> : null}
        </div>
      </div>
    );
  };

  // Determine what to display based on game state
  const renderGameContent = () => {
  const isMyTurn = gameState.turn === gameState.playerId;
  
  // If a round result is available, show the result screen
  if (gameState.result) {
    navigate('/result');
    return null;
  }

  // If it's my turn and both players have selected cards, show attribute selection
  if (isMyTurn && gameState.selectedCard && gameState.opponentSelectedCard) {
    return (
      <div className="game-section your-turn">
        <h2>Your Turn - Select an Attribute</h2>
        <div className="selected-card-display">
          <h3>Your Selected Card</h3>
          <div className="cricket-card selected">
            <div className="card-header">
              <h3>{gameState.selectedCard.playerName}</h3>
            </div>
            <div className="card-stats">
              <div className="stat-row">
                <span className="stat-label">Matches:</span>
                <span className="stat-value">{gameState.selectedCard.matches}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Runs:</span>
                <span className="stat-value">{gameState.selectedCard.runs}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Centuries:</span>
                <span className="stat-value">{gameState.selectedCard.centuries}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Wickets:</span>
                <span className="stat-value">{gameState.selectedCard.wickets}</span>
              </div>
            </div>
          </div>
        </div>
        <AttributeSelection
          selectedCard={gameState.selectedCard}
          selectAttribute={selectAttribute}
          isPowerPlayMode={gameState.activeMode === 'power_play'}
        />
      </div>
    );
  }

  // If it's my turn but I haven't selected a card yet
  if (isMyTurn && !gameState.selectedCard) {
    return (
      <div className="game-section your-turn">
        <h2>Your Turn - Select a Card</h2>
        <CardSelection 
          cards={gameState.playerCards} 
          selectCard={selectCard} 
          selectedCard={gameState.selectedCard}
        />
      </div>
    );
  }

  // If it's opponent's turn but I haven't selected a card yet
  if (!isMyTurn && !gameState.selectedCard) {
    return (
      <div className="game-section opponent-turn">
        <h2>Opponent's Turn - Select Your Card</h2>
        <p className="waiting-message">You still need to select a card</p>
        <CardSelection 
          cards={gameState.playerCards} 
          selectCard={selectCard} 
          selectedCard={gameState.selectedCard}
        />
      </div>
    );
  }

  // If I've selected a card and it's opponent's turn
  if (!isMyTurn && gameState.selectedCard) {
    return (
      <div className="game-section opponent-turn">
        <h2>Opponent's Turn - Waiting</h2>
        <p className="waiting-message">Waiting for opponent to select an attribute...</p>
        <div className="cards-display">
          <div className="your-card">
            <h3>Your Card</h3>
            <div className="cricket-card selected">
              <div className="card-header">
                <h3>{gameState.selectedCard.playerName}</h3>
              </div>
              <div className="card-stats">
                <div className="stat-row">
                  <span className="stat-label">Matches:</span>
                  <span className="stat-value">{gameState.selectedCard.matches}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Runs:</span>
                  <span className="stat-value">{gameState.selectedCard.runs}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Centuries:</span>
                  <span className="stat-value">{gameState.selectedCard.centuries}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Wickets:</span>
                  <span className="stat-value">{gameState.selectedCard.wickets}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="opponent-card">
            <h3>Opponent's Card</h3>
            <OpponentCard 
              card={gameState.opponentSelectedCard} 
              attribute={gameState.currentAttribute}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default state when waiting for both players to join
  return (
    <div className="waiting-for-opponent">
      <h2>Waiting for game to progress...</h2>
      <div className="spinner"></div>
    </div>
  );
};

  return (
    <div className="game-screen">
      {renderHeader()}
      
      {renderGameContent()}
    </div>
  );
};

export default GameScreen;