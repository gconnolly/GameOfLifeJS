function evolve(livingCells) {
    var cellsToInspect = {},    //Set
        result = {},            //Set
        cell,
        cellName;
    
    for(cellName in livingCells) {
        cell = livingCells[cellName];
        
        [
            [ cell[0],      cell[1]     ],
            [ cell[0],      cell[1] - 1 ],
            [ cell[0],      cell[1] + 1 ],
            [ cell[0] + 1,  cell[1]     ],
            [ cell[0] + 1,  cell[1] - 1 ],
            [ cell[0] + 1,  cell[1] + 1 ],
            [ cell[0] - 1,  cell[1]     ],
            [ cell[0] - 1,  cell[1] - 1 ],
            [ cell[0] - 1,  cell[1] + 1 ]
        ].forEach(function (newCell) {
            cellsToInspect[ newCell.join() ] = newCell;
        })
    }
    
    for(cellName in cellsToInspect) {
        cell = cellsToInspect[cellName];
        
        if(determineFateOfCell(livingCells, cell)) {
            result[ cell.join() ] = cell;
        }
    }    

    return result;
}

function determineFateOfCell(livingCells, cell) {
    var livingNeighbors = getNumberOfNeighbors(livingCells, cell);

    return livingCells[ cell.join() ]
        ? (livingNeighbors == 2 || livingNeighbors == 3)
        : livingNeighbors == 3;
}

// return the number of living cells adjacent to the provided cell
function getNumberOfNeighbors(livingCells, cell) {
    return [
        [ cell[0],      cell[1] - 1 ],
        [ cell[0],      cell[1] + 1 ],
        [ cell[0] + 1,  cell[1]     ],
        [ cell[0] + 1,  cell[1] - 1 ],
        [ cell[0] + 1,  cell[1] + 1 ],
        [ cell[0] - 1,  cell[1]     ],
        [ cell[0] - 1,  cell[1] - 1 ],
        [ cell[0] - 1,  cell[1] + 1 ]
    ].reduce(function (sum, current) {
        return livingCells[ current.join() ]
            ? sum + 1
            : sum;
    }, 0);
}

// render living cells in a bounding rectangle
function draw(livingCells) {
    var x, y,
        minX = getMinTuple(livingCells, 0),
        minY = getMinTuple(livingCells, 1),
        maxX = getMaxTuple(livingCells, 0),
        maxY = getMaxTuple(livingCells, 1),
        grid = '\n';

    for (y = minY; y <= maxY; y++) {
        for (x = minX; x <= maxX; x++) {
            grid += livingCells[ [x, y].join() ]
                ? '*'
                : '-';
        }

        grid += '\n';
    };

    return grid;
}

function reduceTupleSet(tupleSet, reduce, initial) {
    var result = initial,
        tupleString;

    for (tupleString in tupleSet) {
        result = reduce(result, tupleSet[tupleString]);
    };

    return result;
}

function getMaxTuple(tupleSet, index) {
    return reduceTupleSet(
        tupleSet,
        function (previous, current) {
            return current[index] > previous
                ? current[index]
                : previous;
        },
        Number.MIN_SAFE_INTEGER
    );
}

function getMinTuple(tupleSet, index) {
    return reduceTupleSet(
        tupleSet,
        function (previous, current) {
            return current[index] < previous
                ? current[index]
                : previous;
        },
        Number.MAX_SAFE_INTEGER
    );
}

function createTupleSetFromArray(arr) {
    return arr.reduce(function (tupleSet, tuple) {
        tupleSet[tuple.join()] = tuple;
        return tupleSet;
    }, {});
}

var slider = createTupleSetFromArray([
        [1, 2],
        [2, 3],
        [3, 1],
        [3, 2],
        [3, 3]            
    ]),
    boom = createTupleSetFromArray([
        [1, 2],
        [2, 4],
        [3, 1],
        [3, 2],
        [3, 5],
        [3, 6],
        [3, 7]
    ]);

evolve(boom);

console.log(draw(boom));
