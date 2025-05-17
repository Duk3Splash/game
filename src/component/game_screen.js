import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardSelection from './card_selection';
import AttributeSelection from './attribute_selection';
import OpponentCard from './opponent_card';
import '../css/game_screen.css';

const GameScreen = ({ gameState, selectCard, selectAttribute }) => {
  const navigate = useNavigate();

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
      <div className="game-header">
        <h1>Cricket Card Game</h1>
        <div className="game-score">
          <div className="score-item">
            <span className="score-label">You:</span>
            <span className="score-value">{gameState.score.player}</span>
          </div>
          <div className="score-divider">-</div>
          <div className="score-item">
            <span className="score-label">Opponent:</span>
            <span className="score-value">{gameState.score.opponent}</span>
          </div>
        </div>
        <div className="round-info">
          <span>Round: {gameState.roundsPlayed + 1}</span>
        </div>
      </div>
      
      {renderGameContent()}
    </div>
  );
};

export default GameScreen;