import React, {useEffect, useState} from 'react';

import PlayAgain from "./PlayAgain";
import StarsDisplay from "./StarsDisplay";
import PlayNumber from "./PlayNumber";
import utils from "../math-utils";

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

export default Game;