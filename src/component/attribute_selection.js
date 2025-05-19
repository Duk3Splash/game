import React, {useState, useEffect} from 'react';
import '../css/attribute_selection.css';

const AttributeSelection = ({ selectedCard, selectAttribute, isPowerPlayMode }) => {
  const [primaryAttribute, setPrimaryAttribute] = useState(null);
  const [secondaryAttribute, setSecondaryAttribute] = useState(null);
  const [selectionComplete, setSelectionComplete] = useState(false);
  
  // Reset internal state when Power Play mode changes
  useEffect(() => {
    console.log('duk3 is powr play', isPowerPlayMode)
    setPrimaryAttribute(null);
    setSecondaryAttribute(null);
    setSelectionComplete(false);
  }, [isPowerPlayMode]);
  
  const attributes = [
    { name: 'matches', label: 'Matches' },
    { name: 'runs', label: 'Runs' },
    { name: 'centuries', label: 'Centuries' },
    { name: 'wickets', label: 'Wickets' }
  ];

  const handleAttributeSelect = (attributeName) => {
    // Don't allow selection if already completed in Power Play mode
    if (isPowerPlayMode && selectionComplete) {
      return;
    }
    
    if (!isPowerPlayMode) {
      // Normal mode - select single attribute and submit immediately
      selectAttribute(attributeName);
    } else {
      // Power Play mode - select two attributes
      if (!primaryAttribute) {
        // First attribute selection
        setPrimaryAttribute(attributeName);
      } else if (!secondaryAttribute && attributeName !== primaryAttribute) {
        // Second attribute selection (different from first)
        setSecondaryAttribute(attributeName);
        // Set completion state but don't submit yet (allow user to confirm)
        setSelectionComplete(true);
      }
    }
  };
  
  const handleConfirmSelection = () => {
    if (isPowerPlayMode && primaryAttribute && secondaryAttribute) {
      // Send both attributes to parent
      console.log('duk3 attributes .....', primaryAttribute, secondaryAttribute)
      selectAttribute(primaryAttribute, secondaryAttribute);
    }
  };
  
  const resetSelection = () => {
    setPrimaryAttribute(null);
    setSecondaryAttribute(null);
    setSelectionComplete(false);
  };

  return (
    <div className="attribute-selection">
      <h3 className={isPowerPlayMode ? 'power-play-title' : ''}>
        {isPowerPlayMode 
          ? "🔄 Power Play Mode: Select TWO attributes to compare" 
          : "Select an attribute to compare:"}
      </h3>
      
      {isPowerPlayMode && (
        <div className="power-play-instruction">
          You'll win if either attribute is higher than your opponent's card
        </div>
      )}
      
      {isPowerPlayMode && primaryAttribute && !secondaryAttribute && (
        <div className="selection-status">
          First attribute selected: <strong>{attributes.find(a => a.name === primaryAttribute)?.label}</strong>
          <br />
          Now select a different attribute as your secondary choice
        </div>
      )}
      
      <div className="attributes-list">
        {attributes.map((attr) => (
          <button
            key={attr.name}
            className={`attribute-button 
              ${primaryAttribute === attr.name ? 'selected-primary' : ''} 
              ${secondaryAttribute === attr.name ? 'selected-secondary' : ''}
              ${(isPowerPlayMode && primaryAttribute === attr.name && !secondaryAttribute) ? 'disabled' : ''}
              ${(isPowerPlayMode && selectionComplete) ? 'selection-done' : ''}`}
            onClick={() => handleAttributeSelect(attr.name)}
            disabled={(isPowerPlayMode && primaryAttribute === attr.name && !secondaryAttribute) || 
                     (isPowerPlayMode && selectionComplete)}
          >
            <span className="attribute-name">{attr.label}</span>
            <span className="attribute-value">{selectedCard[attr.name]}</span>
          </button>
        ))}
      </div>
      
      {isPowerPlayMode && selectionComplete && (
        <div className="power-play-confirmation">
          <div className="selected-attributes">
            <div className="primary-attribute">
              <span className="attribute-label">Primary:</span> 
              <strong>{attributes.find(a => a.name === primaryAttribute)?.label}</strong>
              <span className="attribute-value">{selectedCard[primaryAttribute]}</span>
            </div>
            <div className="secondary-attribute">
              <span className="attribute-label">Secondary:</span> 
              <strong>{attributes.find(a => a.name === secondaryAttribute)?.label}</strong>
              <span className="attribute-value">{selectedCard[secondaryAttribute]}</span>
            </div>
          </div>
          <div className="power-play-actions">
            <button className="reset-selection" onClick={resetSelection}>
              Change Selection
            </button>
            <button className="confirm-selection" onClick={handleConfirmSelection}>
              Confirm Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeSelection;