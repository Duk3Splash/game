import React from 'react';
import '../css/attribute_selection.css';

const AttributeSelection = ({ selectedCard, selectAttribute }) => {
  const attributes = [
    { name: 'matches', label: 'Matches' },
    { name: 'runs', label: 'Runs' },
    { name: 'centuries', label: 'Centuries' },
    { name: 'wickets', label: 'Wickets' }
  ];

  return (
    <div className="attribute-selection">
      <h3>Select an attribute to compare:</h3>
      <div className="attributes-list">
        {attributes.map((attr) => (
          <button
            key={attr.name}
            className="attribute-button"
            onClick={() => selectAttribute(attr.name)}
          >
            <span className="attribute-name">{attr.label}</span>
            <span className="attribute-value">{selectedCard[attr.name]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AttributeSelection;
