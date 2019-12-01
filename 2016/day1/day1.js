const fs = require('fs')

const instructions = fs
	.readFileSync('input.txt')
	.toString()
	.replace(/,/g, '')
	.split(' ')

//GLOBAL
const fromOrigin = {
	x: 0,
	y: 0,
	previousLocations: [],
}

//? Apparently modulo in JS with negative numbers works kind of weirdly.. didn't look too much into it
//? https://stackoverflow.com/a/17323608/9269227 grabbed the function from here
function mod(n, m) {
	return ((n % m) + m) % m
}

//Will determine based on directionIndex which way we are facing and move the appropriate direction
const move = (directionIndex, spaces) => {
	switch (mod(directionIndex, 4)) {
		case 0: //north
			fromOrigin.y += spaces
			break
		case 1: //east
			fromOrigin.x += spaces
			break
		case 2: //south
			fromOrigin.y -= spaces
			break
		case 3: //west
			fromOrigin.x -= spaces
			break
		default:
			;`Unexpected case: ${directionIndex % 4}`
	}
}

const part1 = () => {
	let playerDirection = 'north'
	let directionIndex = 0
	instructions.map(instruction => {
		const [turn] = instruction //array destructuring lets us pull the first character off the string and assign it a value
		const spaces = instruction.slice(1) //slicing from the 2nd character and providing no end character means we will take the rest of the strings

		if (turn == 'L') {
			directionIndex--
		} else if (turn == 'R') {
			directionIndex++
		}
		move(directionIndex, Number(spaces))
	})

	return Math.abs(fromOrigin.y) + Math.abs(fromOrigin.x)
}

const part2 = () => {
	let playerDirection = 'north'
	let directionIndex = 0
	let visitedLocations = new Set([[0, 0]])
	console.log(`INSTRUCITON SIZE`, instructions.length)
	instructions.map(instruction => {
		const [turn] = instruction
		const spaces = instruction.slice(1)

		if (turn == 'L') {
			directionIndex--
		} else if (turn == 'R') {
			directionIndex++
		}
		move(directionIndex, Number(spaces))
		const locationSize = visitedLocations.size
		visitedLocations.add([fromOrigin.x, fromOrigin.y])
		if (locationSize === visitedLocations.size) {
			console.log('FOUND!', fromOrigin)
		}
	})
	console.log(visitedLocations)
}

console.log(part2())
