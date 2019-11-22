const fs = require('fs')

const instructions = fs
	.readFileSync('input.txt')
	.toString()
	.split('')

//The first Array.from() will create the columns, and the second will create the rows
const grid = Array.from({ length: 5000 }, () => Array.from({ length: 5000 }).fill(0))

//start Santa in the middle of the 5000x5000 array
let santa = [2500, 2500]
let deliveries = 0

const moveSanta = instruction => {
	if (instruction === '^') santa[0]--
	else if (instruction === 'v') santa[0]++
	else if (instruction === '<') santa[1]--
	else if (instruction === '>') santa[1]++
}

//increment the spot on the grid that Santa is at, denoting a new gift
const deliverGift = () => {
	grid[santa[0]][santa[1]]++
}

function part1() {
	deliverGift()
	instructions.map((instruction, i) => {
		moveSanta(instruction)
		deliverGift()
	})

	for (i = 0; i < grid.length; i++) {
		for (j = 0; j < grid.length; j++) {
			if (grid[i][j] > 0) {
				deliveries++
			}
		}
	}
	return deliveries
}

console.log(part1())
