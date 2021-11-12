import React from 'react';
import utils from '../math-utils'

const StarsDisplay = props => (
    // no additional DOM elements, use JSX fragment
    <>
        {utils.range(1, props.count).map(starId =>
            <div key={starId} className="star">&nbsp;</div>
        )}
    </>
);

export default StarsDisplay;
