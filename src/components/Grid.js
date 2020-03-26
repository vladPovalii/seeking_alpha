// @flow
import React, {useState, useRef, useCallback, useEffect} from 'react';

import GridView from '../components/GridView';
import useDelay from '../hooks/useDelay';
import {getRandomBinary} from './utils';

const getInitialState = size => {
    return [...Array(size).keys()].map(() => {
        return [...Array(size).keys()].map(() => getRandomBinary());
    });
};

const getLivingNeighboursCount = (grid, x, y) => {
    let livingCount = 0;

    // edge cases
    const [xMin, xMax] = x === 0 ? [0, x + 1] : x === grid.length - 1 ? [x - 1, x] : [x - 1, x + 1];
    const [yMin, yMax] = y === 0 ? [0, y + 1] : y === grid.length - 1 ? [y - 1, y] : [y - 1, y + 1];

    for (let i = xMin; i <= xMax; i++) {
        for (let j = yMin; j <= yMax; j++) {
            livingCount += grid[i][j];
        }
    }

    // exclude self
    livingCount = livingCount - grid[x][y];

    return livingCount;
};

const getNextCellState = (isAlive, neighboursCount) => {
    if (isAlive) {
        // Any live cell with fewer than two live neighbours dies (underpopulation).
        // Any live cell with two or three live neighbours lives on to the next generation.
        // Any live cell with more than three live neighbours dies (overcrowding).
        return neighboursCount === 2 || neighboursCount === 3 ? 1 : 0;
    }
    // Any dead cell with exactly three live neighbours becomes a live cell (reproduction).
    return neighboursCount === 3 ? 1 : 0;
}

// const getNextGridState = grid => {
//     const copy = JSON.parse(JSON.stringify(grid));
//     for (let x = 0; x < copy.length; x++) {
//         for (let y = 0; y < copy.length; y++) {
//             const livingCount = getLivingNeighboursCount(copy, x, y);
//             const isAlive = !!copy[x][y];
//             copy[x][y] = getNextCellState(isAlive, livingCount);
//         }
//     }
//     return copy;
// };

const getNextGridState = grid => {
    return grid.map((row, x) => {
        return row.map((value, y) => {
            const livingCount = getLivingNeighboursCount(grid, x, y);
            const isAlive = !!value;
            if (isAlive) {
                // Any live cell with fewer than two live neighbours dies (underpopulation).
                // Any live cell with two or three live neighbours lives on to the next generation.
                // Any live cell with more than three live neighbours dies (overcrowding).
                return livingCount === 2 || livingCount === 3 ? 1 : 0;
            }
            // Any dead cell with exactly three live neighbours becomes a live cell (reproduction).
            return livingCount === 3 ? 1 : 0;
        });
    });
}

const Grid = ({size, initialDelay}) => {

    const [grid, setGrid] = useState(getInitialState(size));
    const [running, setRunning] = useState(false);
    const [delay, setDelay] = useState(initialDelay);

    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }

        setGrid((g) => getNextGridState(g));

        setTimeout(runSimulation, 50
        );
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    setRunning(!running);
                    if (!running) {
                        runningRef.current = true;
                        runSimulation();
                    }
                }}
            >
                {running ? "stop" : "start"}
            </button>
            <button>
                Generate new
            </button>

            {/*<GridView grid={grid}/>*/}
            {grid.map((row, i) => (
                <div key={i} style={{display: 'flex', flexDirection: 'row'}}>
                    {row.map((value, j) => <div
                        style={{width: 10, height: 10, backgroundColor: value ? 'black' : 'white'}}
                        key={`${i}-${j}`}/>)}
                </div>
            ))}
        </>
    )
};

Grid.defaultProps = {
    size: 50,
    delay: 50 // ms
};

export default Grid;
