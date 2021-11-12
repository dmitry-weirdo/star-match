import React from 'react';

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

// Color Theme - used by PlayNumber only, therefore in this file
const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    candidate: 'deepskyblue',
};

export default PlayNumber;
