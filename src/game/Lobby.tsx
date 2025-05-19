import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, push, set, get, update } from "firebase/database";
import { db } from "../firebase/config";

export const Lobby = () => {
  const [playerName, setPlayerName] = useState("");
  const [joinId, setJoinId] = useState("");
  const navigate = useNavigate();

  const createGame = async () => {
    if (!playerName.trim()) return;
    const gameRef = push(ref(db, "games"));
    const gameId = gameRef.key!;
    localStorage.setItem("playerName", playerName);

    await set(gameRef, {
      players: [playerName],
      status: "waiting"
    });

    navigate(`/game/${gameId}`);
  };

  const joinGame = async () => {
    if (!playerName || !joinId) return;
    const gameRef = ref(db, `games/${joinId}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      alert("Game not found!");
      return;
    }

    const data = snapshot.val();
    if (data.players.includes(playerName)) {
      // Already in game
    } else {
      await update(gameRef, {
        players: [...data.players, playerName]
      });
    }

    localStorage.setItem("playerName", playerName);
    navigate(`/game/${joinId}`);
  };

  return (
    <div>
      <h1>Lobby</h1>
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
      />
      <br />
      <button onClick={createGame}>Create Game</button>

      <hr />

      <input
        value={joinId}
        onChange={(e) => setJoinId(e.target.value)}
        placeholder="Enter game ID to join"
      />
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
};
