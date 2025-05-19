import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from './lib/firebase';
import { useNavigate } from 'react-router-dom';

export const Lobby = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const createGame = async () => {
    const gameRef = push(ref(db, 'games'));
    await set(gameRef, {
      players: [playerName],
      status: 'waiting'
    });
    navigate(`/game/${gameRef.key}`);
  };

  return (
    <div>
      <h1>Lobby</h1>
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={createGame}>Create Game</button>
    </div>
  );
};
