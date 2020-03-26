// @flow
import React, {useState, useCallback, useEffect, useRef} from 'react';

type Props = {
    size: number,
    delay: number,
    isRunning: boolean,
};

const getInitialState = (size: number) => {
    return Array(size).fill(0).map(() => {
        // seed random binary:
        return Array(size).fill(0).map(() => Math.round(Math.random()));
    });
};

const getAliveNeighboursCount = (grid: Array<Array<number>>, x: number, y: number): number => {
    let aliveCount: number = 0;

    // handle edge cases
    const [xFrom: number, xTo: number] = x === 0 ? [0, x + 1] : x === grid.length - 1 ? [x - 1, x] : [x - 1, x + 1];
    const [yFrom: number, yTo: number] = y === 0 ? [0, y + 1] : y === grid.length - 1 ? [y - 1, y] : [y - 1, y + 1];

    // count all nearest cells
    for (let i = xFrom; i <= xTo; i++) {
        for (let j = yFrom; j <= yTo; j++) {
            aliveCount += grid[i][j];
        }
    }

    // exclude self!
    aliveCount = aliveCount - grid[x][y];

    return aliveCount;
};

const getNextGridState = (grid: Array<Array<number>>): Array<Array<number>> => {
    return grid.map((row: Array<number>, x: number) => {
        return row.map((value: number, y: number) => {
            const aliveCount: number = getAliveNeighboursCount(grid, x, y);
            const isAlive: boolean = !!value;
            if (isAlive) {
                // Any live cell with fewer than two live neighbours dies (underpopulation).
                // Any live cell with two or three live neighbours lives on to the next generation.
                // Any live cell with more than three live neighbours dies (overcrowding).
                return aliveCount === 2 || aliveCount === 3 ? 1 : 0;
            }
            // Any dead cell with exactly three live neighbours becomes a live cell (reproduction).
            return aliveCount === 3 ? 1 : 0;
        });
    });
};

const Grid = (props: Props) => {
    const { size, delay, isRunning } = props;
    const [grid, setGrid] = useState(getInitialState(size));

    const runningRef = useRef(isRunning);

    const processTick = useCallback(() => {
        if(!runningRef.current) return;

        setGrid(prev => getNextGridState(prev));
        setTimeout(processTick, delay);
    }, [delay]);

    useEffect(() => {
        runningRef.current = isRunning;
        if (isRunning) processTick();
    }, [isRunning]);

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${size}, 15px)`
        }}>
            {grid.map((row, i) => (
                row.map((value, j) => <div
                    style={{
                        width: 15,
                        height: 15,
                        backgroundColor: value ? 'black' : 'white',
                        border: "solid thin grey"
                    }}
                    key={`${i}-${j}`}
                />)
            ))}
        </div>
    )
};

Grid.defaultProps = {
    size: 50,
    delay: 25 // ms
};

export default Grid;
