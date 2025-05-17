import React from 'react';
import '../css/card_selection.css';

const CardSelection = ({ cards, selectCard, selectedCard }) => {
  return (
    <div className="card-selection">
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div 
            key={index}
            className={`cricket-card ${selectedCard && selectedCard.id === card.id ? 'selected' : ''}`}
            onClick={() => selectCard(card)}
          >
            <div className="card-header">
              <h3>{card.playerName}</h3>
            </div>
            <div className="card-stats">
              <div className="stat-row">
                <span className="stat-label">Matches:</span>
                <span className="stat-value">{card.matches}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Runs:</span>
                <span className="stat-value">{card.runs}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Centuries:</span>
                <span className="stat-value">{card.centuries}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Wickets:</span>
                <span className="stat-value">{card.wickets}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelection;