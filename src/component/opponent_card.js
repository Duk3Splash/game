import React from 'react';
import '../css/opponent_card.css';

const OpponentCard = ({ card, attribute }) => {
  if (!card) {
    return (
      <div className="cricket-card opponent hidden">
        <div className="card-back">
          <span>Waiting for opponent...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cricket-card opponent">
      <div className="card-header">
        <h3>{card.playerName}</h3>
      </div>
      <div className="card-stats">
        {attribute ? (
          <div className={`stat-row highlighted ${attribute}`}>
            <span className="stat-label">
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}:
            </span>
            <span className="stat-value">{card[attribute]}</span>
          </div>
        ) : (
          <div className="card-back">
            <span>Opponent has selected a card</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpponentCard;