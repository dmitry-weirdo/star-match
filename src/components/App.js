import * as React from 'react';
import { useState, useEffect } from 'react';


// Star Match app
// STAR MATCH - Starting Template

const StarsDisplay = props => (
    // no additional DOM elements, use JSX fragment
    <>
      {utils.range(1, props.count).map(starId =>
          <div key={starId} className="star"/>
      )}
    </>
);

// Number is a bad name
const PlayNumber = props => (
    <button
        className="number"
        style={{ backgroundColor: colors[props.status] }}
        // onClick={() => console.log('Num', props.number)}
        onClick={() => props.onClick(props.number, props.status)}
    >
      {props.number}

    </button>
);

const PlayAgain = props => (
    <div className="game-done">
      <div
          className="message"
          style={{ color: props.gameStatus === 'lost' ? 'red' : 'green' }}
      >
        {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
      </div>

      <button onClick={props.onClick}>Play Again</button>
    </div>
);


// Custom Hook - stateful function, group hook functions
// start with "use" is a hook function naming convention, causes lint checks
// hook is a state manager
const useGameState = () => {

  const [stars, setStars] = useState(utils.random(1, 9)); // useState hook

  const [availableNums, setAvailableNums] = useState(utils.range(1, 9)); // mock values
  const [candidateNums, setCandidateNums] = useState([]); // mock values
  const [secondsLeft, setSecondsLeft] = useState(10);

  // setInterval, React will invoke the render -> setTimeout

  useEffect(() => { // hook for side-effect
    console.log('Rendered...');

    if (secondsLeft > 0 && (availableNums.length > 0)) { // only add timer if game is not won
      const timerId = setTimeout(() => { // after 1 second, decrease the "time remaining"
        setSecondsLeft(secondsLeft - 1); // changes the state
      }, 1000); // each second

      return () => clearTimeout(timerId);
    }

    console.log('Done rendering');
    return () => console.log('Component is going to re-render');
  });


  const setGameState = (newCandidateNums) => {
    // candidateNums
    // const newCandidateNums = candidateNums.concat(number);
    if (utils.sum(newCandidateNums) !== stars) { // no correct answer -> mark as candidate
      setCandidateNums(newCandidateNums)
    }
    else { // correct pick -> remove candidates, redraw stars
      const newAvailableNums = availableNums.filter( // remove candidates from availableNums
          n => !newCandidateNums.includes(n)
      );

      // redraw stars (from what IS available)
      setStars(utils.randomSumIn(newAvailableNums, 9));

      setAvailableNums(newAvailableNums); // state hook updater function
      setCandidateNums([]);
    }
  };

  return {
    stars, availableNums, candidateNums, secondsLeft, setGameState
  }; // we can return anything
}



const Game = (props) => {
  const { // destructure, read values from the custom hook
    stars, availableNums, candidateNums, secondsLeft, setGameState
  } = useGameState();

  const candidatesAreWrong = utils.sum(candidateNums) > stars;

  const gameIsWon = availableNums.length === 0;
  const gameIsLost = secondsLeft === 0;

  const gameStatus = (availableNums.length === 0)
      ? 'won'
      : (secondsLeft == 0) ? 'lost' : 'active'
  ;


  // const resetGame = () => {
  //   setStars(utils.random(1, 9));
  //   setAvailableNums(utils.range(1, 9));
  //   setCandidateNums([]);
  // }

  // candidateNums
  // wrongNums - inverse of candidateNums
  // usedNums
  // availableNums - inverse of usedNums

  const numberStatus = (number) => { // returns style name from "colors"
    if (!availableNums.includes(number)) {
      return 'used';
    }

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }

    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    // currentStatus => newStatus

    if (gameStatus !== 'active') { // game won or lost -> do nothing
      return;
    }

    if (currentStatus === 'used') { // do nothing
      return;
    }

    const newCandidateNums = (currentStatus === 'available')
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number); // not available -> remove from candidates, "unclick"

    setGameState(newCandidateNums);
  };

  return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">

          <div className="left">
            {gameStatus !== 'active' ? (
                <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
            ): (
                <StarsDisplay count={stars}/>
            )}
          </div>

          <div className="right">
            {utils.range(1, 9).map(number =>
                <PlayNumber
                    key={number}
                    number={number}
                    status={numberStatus(number)}
                    onClick={onNumberClick}
                />
            )}
          </div>
        </div>

        <div className="timer">Time Remaining: {secondsLeft}</div>

      </div>
  );
};


const StarMatch = () => {
  const [gameId, setGameId] = useState(1);

  // gameId is immutable constant, cannot do gameId++
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>; // change id -> React will unmount old, mount new Game
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

// ReactDOM.render(<StarMatch />, mountNode);


export function App() {
  return (
      <StarMatch/>
  );
}
