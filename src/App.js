import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';

import LobbyScreen from './component/lobby_screen';
import GameScreen from './component/game_screen';
import CardSelection from './component/card_selection';
import ResultScreen from './component/result_screen';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    isInGame: false,
    gameId: null,
    playerId: null,
    opponentId: null,
    playerCards: [],
    selectedCard: null,
    opponentSelectedCard: null,
    currentAttribute: null,
    secondAttribute: null, // For Power Play mode
    turn: null,
    result: null,
    health: { player: 100, opponent: 100 },
    roundsPlayed: 0,
    totalRounds: 10,
    // Special mode properties
    showModeSelection: true,
    availableModes: ['free_hit', 'super', 'power_play', 'world_cup'],
    activeMode: null,
    opponentMode: null,
    modeNotification: null,
    damageMultiplier: 1, // Track damage multiplier from special modes
    modeEffect: '', // Description of the mode effect
  });

  // Initialize socket connection
  useEffect(() => {
    // In a real app, replace with your actual WebSocket server URL
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    // Setup socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('player_connected', { playerId: newSocket.id });
    });

    newSocket.on('game_created', (data) => {
      console.log('duk3 game_created ..... ', data);
      setGameState(prevState => ({
        ...prevState,
        isInGame: true,
        gameId: data.gameId,
        playerId: data.playerId,
        turn: data.turn,
      }));
    });

    newSocket.on('game_joined', (data) => {
      console.count('duk3 game_joined ......', data);
      setGameState(prevState => ({
        ...prevState,
        isInGame: true,
        gameId: data.gameId,
        playerId: data.playerId,
        opponentId: data.opponentId,
        playerCards: data.cards,
        turn: data.turn,
      }));
    });


     // Handler for available modes
    newSocket.on('available_modes', (data) => {
      console.log("Available modes received:", data);
      
      setGameState(prevState => ({
        ...prevState,
        availableModes: data.available
      }));
    });
    
    // Handler for mode activation notifications
    newSocket.on('mode_activated', (data) => {
      console.log("Mode activated:", data);
      
      setGameState(prevState => ({
        ...prevState,
        modeNotification: data,
        // If it's opponent's mode, update opponentMode
        ...(data.player === 'opponent' ? { opponentMode: data.mode } : {})
      }));
      
      // Clear notification after a few seconds
      setTimeout(() => {
        setGameState(prevState => ({
          ...prevState,
          modeNotification: null
        }));
      }, 4000);
    });

    newSocket.on('opponent_selected_card', (data) => {
      console.log('duk3 opponent_selected_card ......', data);
      setGameState(prevState => ({
        ...prevState,
        opponentSelectedCard: data.card,
      }));
    });

     newSocket.on("turn_update", (data) => {
       console.log("Turn update received:", data);

       setGameState((prevState) => ({
         ...prevState,
         turn: data.turn,
       }));
     });

    newSocket.on("round_result", (data) => {
      console.log("Round result received:", data);

       setGameState(prevState => ({
        ...prevState,
        result: data.result,
        health: data.health,
        turn: data.nextTurn,
        roundsPlayed: prevState.roundsPlayed + 1,
        totalRounds: data.totalRounds || 10,
        activeMode: prevState.activeMode,
        showModeSelection: prevState.activeMode ?  false : true,
        opponentMode: data.opponentMode,
        currentAttribute: data.attribute,
        secondAttribute: data.secondAttribute,
        damageMultiplier: data.damageMultiplier || 1,
        modeEffect: data.effect || '',
        playerCards: data.cards
      }));
    });

    newSocket.on('attribute_selected', (data) => {
      setGameState(prevState => ({
        ...prevState,
        currentAttribute: data.attribute,
        secondAttribute: data.secondAttribute,
      }));
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle creating a new game
const createGame = () => {
  if (socket) {
    console.log("Creating game...");
    socket.emit('create_game');
    
    // Optional: Add some temporary feedback while waiting for server response
    setGameState(prevState => ({
      ...prevState,
      isCreatingGame: true
    }));
  }
};

// Handle joining an existing game
const joinGame = (gameId) => {
  if (socket) {
    console.log(`Joining game ${gameId}...`);
    socket.emit('join_game', { gameId });
    
    // Optional: Add some temporary feedback while waiting for server response
    setGameState(prevState => ({
      ...prevState,
      isJoiningGame: true
    }));
  }
};

  // Handle selecting a card
  const selectCard = (card) => {
    setGameState(prevState => ({
      ...prevState,
      selectedCard: card
    }));
    
    if (socket) {
      socket.emit('select_card', {
        gameId: gameState.gameId,
        playerId: gameState.playerId,
        card: card
      });

      // Get available modes from the server
      socket.emit('get_available_modes', {
        gameId: gameState.gameId,
        playerId: gameState.playerId
      });
    }
  };

  // Handle selecting an attribute to compare
  const selectAttribute = (attribute, secondAttribute = null) => {
    if (socket) {
      socket.emit('select_attribute', {
        gameId: gameState.gameId,
        playerId: gameState.playerId,
        attribute: attribute,
        secondAttribute: secondAttribute
      });
    }
  };

  // Handle special mode selection
  const selectSpecialMode = (modeId) => {
    console.log("Special mode selected:", modeId);
    
    if (socket) {
      // Send the selected mode to the server
      socket.emit('activate_special_mode', {
        gameId: gameState.gameId,
        playerId: gameState.playerId,
        modeId: modeId
      });
      
      // Update local state
      setGameState(prevState => ({
        ...prevState,
        activeMode: modeId         // Track the active mode
      }));
      
      // If the mode was skipped, just close the modal
      if (modeId === null) {
        console.log("Special mode selection skipped");
      } else {
        // Show a local notification (server will also broadcast to opponent)
        setGameState(prevState => ({
          ...prevState,
          modeNotification: {
            mode: modeId,
            player: 'you'
          }
        }));
      }
    } else {
      console.error("Socket not connected, cannot select special mode");
    }
  };


  

  const resetRoundState = () => {
  setGameState(prevState => ({
    ...prevState,
    selectedCard: null,
    opponentSelectedCard: null,
    currentAttribute: null,
    result: null,
  }));
};



  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <LobbyScreen
                createGame={createGame}
                joinGame={joinGame}
                gameId={gameState.gameId}
                isInGame={gameState.isInGame}
              />
            }
          />
          <Route
            path="/game"
            element={
              <GameScreen
                gameState={gameState}
                selectCard={selectCard}
                selectAttribute={selectAttribute}
                selectSpecialMode={selectSpecialMode} 
              />
            }
          />
          <Route
            path="/select-card"
            element={
              <CardSelection
                cards={gameState.playerCards}
                selectCard={selectCard}
                selectedCard={gameState.selectedCard}
              />
            }
          />
          <Route
            path="/result"
            element={
              <ResultScreen
                result={gameState.result}
                health={gameState.health}
                playerCard={gameState.selectedCard}
                opponentCard={gameState.opponentSelectedCard}
                attribute={gameState.currentAttribute}
                onFinishView={resetRoundState}
                totalCards={gameState.playerCards}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;