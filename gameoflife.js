(function () {
	function evolve(livingCells) {
	    var cellsToInspect = {},    //Set
	        result = {},            //Set
	        cell,
	        cellName;
	    
	    for(cellName in livingCells) {
	    	if (livingCells.hasOwnProperty(cellName)) {
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
		        ].forEach(setTuple.bind(this, cellsToInspect));
	    	}
	    }
	    
	    for(cellName in cellsToInspect) {
	    	if (cellsToInspect.hasOwnProperty(cellName)) {
		        cell = cellsToInspect[cellName];
		        
		        if(determineFateOfCell(livingCells, cell)) {
		        	setTuple(result, cell);
		        }
	    	}
	    }    

	    return result;
	}

	function determineFateOfCell(livingCells, cell) {
	    var livingNeighbors = getNumberOfNeighbors(livingCells, cell);

	    return livingCells[ cell.join() ] ? 
	      	(livingNeighbors == 2 || livingNeighbors == 3)
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
	        return livingCells[ current.join() ] ?
	          	sum + 1
	            : sum;
	    }, 0);
	}

	function setTuple(tupleSet, tuple) {
		tupleSet[ tuple.join() ] = tuple;

		return tupleSet;
	}

	function reduceTupleSet(tupleSet, reduce, initial) {
	    var result = initial,
	        tupleString;

	    for (tupleString in tupleSet) {
			if (tupleSet.hasOwnProperty(tupleString)) {
	        	result = reduce(result, tupleSet[tupleString]);
	    	}
	    }

	    return result;
	}

	function getMaxTuple(tupleSet, index) {
	    return reduceTupleSet(
	        tupleSet,
	        function (previous, current) {
	            return current[index] > previous ? 
	              	current[index]
	                : previous;
	        },
	        Number.MIN_SAFE_INTEGER
	    );
	}

	function getMinTuple(tupleSet, index) {
	    return reduceTupleSet(
	        tupleSet,
	        function (previous, current) {
	            return current[index] < previous ? 
	              	current[index]
	                : previous;
	        },
	        Number.MAX_SAFE_INTEGER
	    );
	}

	function createTupleSetFromArray(arr) {
	    return arr.reduce(setTuple, {});
	}

	// render living cells in a bounding rectangle
	function draw(livingCells) {
	    var x, y,
	        minX = getMinTuple(livingCells, 0),
	        minY = getMinTuple(livingCells, 1),
	        maxX = getMaxTuple(livingCells, 0),
	        maxY = getMaxTuple(livingCells, 1),
	        grid = '<br/>';

	    for (y = minY; y <= maxY; y++) {
	        for (x = minX; x <= maxX; x++) {
	            grid += livingCells[ [x, y].join() ] ? 
	              	'*'
	                : '&nbsp;';
	        }

	        grid += '<br/>';
	    }

	    return grid;
	}

	window.evolve = evolve;
	window.draw = draw;
	window.createTupleSetFromArray = createTupleSetFromArray;
}());

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
