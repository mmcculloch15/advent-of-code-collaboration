const fs = require('fs')

const wires = fs
	.readFileSync('input.txt')
	.toString()
	.split('\n')

const firstWire = wires[0].split(',')
const secondWire = wires[1].split(',')
const grid = []
const wireLength = [undefined, 0, 0]
let answer = Infinity
const currentPosition = {
	x: 0,
	y: 0,
}

const layWire = (direction, distance, wireNum) => {
	for (i = 0; i < distance; i++) {
		wireLength[wireNum]++ //increase the length of the wire
		if (direction === 'D') createGridNode(currentPosition.x + 1, currentPosition.y, wireNum)
		else if (direction === 'U') createGridNode(currentPosition.x - 1, currentPosition.y, wireNum)
		else if (direction === 'L') createGridNode(currentPosition.x, currentPosition.y - 1, wireNum)
		else if (direction === 'R') createGridNode(currentPosition.x, currentPosition.y + 1, wireNum)
	}
}

const createGridNode = (x, y, wireNum) => {
	currentPosition.x = x
	currentPosition.y = y

	if (grid[x]) {
		//Need to do this first.  If we try to check grid[x][y] and it doesn't exist, it blows up
		if (grid[x][y]) {
			//If the first wire has already touched this spot, this will be an object with the wire number and the length of wire necessary to get there
			if (typeof grid[x][y] === 'object' && grid[x][y].wire != wireNum) {
				if ((grid[x][y].value + wireLength[wireNum]) < answer) {
					answer = grid[x][y].value + wireLength[wireNum]
				}
				grid[x][y] = 'INTERSECTION' //change it to a different value so we don't match it again
			}
		} else grid[x][y] = { wire: wireNum, value: wireLength[wireNum] }
	} else {
		//If we are entering a new row, instantiate it
		grid[x] = []
		grid[x][y] = { wire: wireNum, value: wireLength[wireNum] } //save which wire has crossed this coordinate, and how long it was
	}
}

//place the first wire on the grid
firstWire.map(instruction => {
	const direction = instruction[0]
	const distance = Number(instruction.substring(1))
	layWire(direction, distance, 1)
})

//reset back to the origin for the 2nd wire
currentPosition.x = 0
currentPosition.y = 0

//place the second wire on the grid
secondWire.map(instruction => {
	const direction = instruction[0]
	const distance = Number(instruction.substring(1))
	layWire(direction, distance, 2)
})

console.log(`Answer: ${answer}`)
