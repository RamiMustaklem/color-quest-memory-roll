import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Lobby } from './game/Lobby';
import { GameRoom } from './game/GameRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:gameId" element={<GameRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
