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
    turn: null,
    result: null,
    score: { player: 0, opponent: 0 },
    roundsPlayed: 0,
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
      setGameState(prevState => ({
        ...prevState,
        isInGame: true,
        gameId: data.gameId,
        playerId: data.playerId,
      }));
    });

    newSocket.on('game_joined', (data) => {
      console.count('duk3 ,.........., rajat');
      setGameState(prevState => ({
        ...prevState,
        isInGame: true,
        gameId: data.gameId,
        playerId: data.playerId,
        opponentId: data.opponentId,
        playerCards: data.cards,
      }));
    });

    newSocket.on('opponent_selected_card', (data) => {
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

      setGameState((prevState) => ({
        ...prevState,
        result: data.result,
        score: data.score,
        turn: data.nextTurn,
        roundsPlayed: prevState.roundsPlayed + 1,
        // Don't clear these until after showing result screen
        // We'll clear them after navigating back from result
      }));
    });

    newSocket.on('attribute_selected', (data) => {
      setGameState(prevState => ({
        ...prevState,
        currentAttribute: data.attribute,
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
    }
  };

  // Handle selecting an attribute to compare
  const selectAttribute = (attribute) => {
    if (socket) {
      socket.emit('select_attribute', {
        gameId: gameState.gameId,
        playerId: gameState.playerId,
        attribute: attribute
      });
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
                score={gameState.score}
                playerCard={gameState.selectedCard}
                opponentCard={gameState.opponentSelectedCard}
                attribute={gameState.currentAttribute}
                onFinishView={resetRoundState}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;