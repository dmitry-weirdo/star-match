import * as React from 'react';
import {useState} from 'react';
import Game from "./Game";

// Star Match app
// STAR MATCH - Starting Template
const StarMatch = () => {
  const [gameId, setGameId] = useState(1);

  // gameId is immutable constant, cannot do gameId++
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>; // change id -> React will unmount old, mount new Game
}

// ReactDOM.render(<StarMatch />, mountNode);

// does not work, contrary to the tutorial
// export default StarMatch;

export function App() {
  return (
      <StarMatch/>
  );
}
