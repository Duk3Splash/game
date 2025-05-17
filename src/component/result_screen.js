import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/result_screen.css';

const ResultScreen = ({ result, score, playerCard, opponentCard, attribute, onFinishView }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ResultScreen mounted with props:", { result, score, playerCard, opponentCard, attribute });
    
    if (!result || !playerCard || !opponentCard || !attribute) {
      console.error("Missing required props for ResultScreen:", { result, playerCard, opponentCard, attribute });
      navigate('/game');
      return;
    }

    // Auto-redirect back to game after showing result
    const timeout = setTimeout(() => {
      console.log("Timeout triggered, navigating back to game");
      onFinishView();
      navigate('/game');
    }, 5000);

    return () => {
      console.log("ResultScreen unmounting, clearing timeout");
      clearTimeout(timeout);
    };
  }, [result, playerCard, opponentCard, attribute, navigate]);

  // Safety check
  if (!result || !playerCard || !opponentCard || !attribute) {
    return <div className="loading">Loading result data...</div>;
  }

  const getAttributeDisplay = (attr) => {
    switch(attr) {
      case 'matches': return 'Matches';
      case 'runs': return 'Runs';
      case 'centuries': return 'Centuries';
      case 'wickets': return 'Wickets';
      default: return attr;
    }
  };

  

  const getResultTitle = () => {
    if (result === 'win') return 'You Win!';
    if (result === 'lose') return 'You Lose';
    return 'It\'s a Draw!';
  };

  const getResultClass = () => {
    if (result === 'win') return 'win';
    if (result === 'lose') return 'lose';
    return 'draw';
  };

  return (
    <div className="result-screen">
      <h1 className={`result-title ${getResultClass()}`}>{getResultTitle()}</h1>
      
      <div className="result-details">
        <p className="compared-attribute">
          Compared {getAttributeDisplay(attribute)}
        </p>
        
        <div className="cards-comparison">
          <div className="player-side">
            <h3>Your Card</h3>
            <div className="cricket-card">
              <div className="card-header">
                <h3>{playerCard.playerName}</h3>
              </div>
              <div className="card-stats">
                <div className={`stat-row ${attribute === 'matches' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Matches:</span>
                  <span className="stat-value">{playerCard.matches}</span>
                </div>
                <div className={`stat-row ${attribute === 'runs' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Runs:</span>
                  <span className="stat-value">{playerCard.runs}</span>
                </div>
                <div className={`stat-row ${attribute === 'centuries' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Centuries:</span>
                  <span className="stat-value">{playerCard.centuries}</span>
                </div>
                <div className={`stat-row ${attribute === 'wickets' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Wickets:</span>
                  <span className="stat-value">{playerCard.wickets}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="vs-indicator">VS</div>

          <div className="opponent-side">
            <h3>Opponent's Card</h3>
            <div className="cricket-card">
              <div className="card-header">
                <h3>{opponentCard.playerName}</h3>
              </div>
              <div className="card-stats">
                <div className={`stat-row ${attribute === 'matches' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Matches:</span>
                  <span className="stat-value">{opponentCard.matches}</span>
                </div>
                <div className={`stat-row ${attribute === 'runs' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Runs:</span>
                  <span className="stat-value">{opponentCard.runs}</span>
                </div>
                <div className={`stat-row ${attribute === 'centuries' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Centuries:</span>
                  <span className="stat-value">{opponentCard.centuries}</span>
                </div>
                <div className={`stat-row ${attribute === 'wickets' ? 'highlighted' : ''}`}>
                  <span className="stat-label">Wickets:</span>
                  <span className="stat-value">{opponentCard.wickets}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="score-update">
          <h3>Current Score</h3>
          <div className="score-display">
            <span className="you">You: {score.player}</span>
            <span className="divider">-</span>
            <span className="opponent">Opponent: {score.opponent}</span>
          </div>
        </div>
      </div>
      
      <div className="continue-prompt">
        <p>Continuing to next round...</p>
        <div className="countdown-timer"></div>
      </div>
    </div>
  );
};

export default ResultScreen;