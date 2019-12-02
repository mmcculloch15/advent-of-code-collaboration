const fs = require('fs')

const initialIntcodes = fs
	.readFileSync('input.txt')
	.toString()
	.split(',')
	.map(value => Number(value))

//PART 1
// intcodes[1] = 12
// intcodes[2] = 2

// for (i = 0; i < intcodes.length; i += 4) {
// 	const opCode = intcodes[i]
// 	const firstPosition = intcodes[i + 1]
// 	const secondPosition = intcodes[i + 2]
// 	const resultsPosition = intcodes[i + 3]

// 	let result

// 	if (opCode === 1) result = intcodes[firstPosition] + intcodes[secondPosition]
// 	else if (opCode === 2) result = intcodes[firstPosition] * intcodes[secondPosition]
// 	else if (opCode === 99) {
// 		break
// 	}

// 	intcodes[resultsPosition] = result
// }

// console.log(intcodes)

const expectedOutput = 19690720
let noun = 0
let verb = 0

const limit = 99

while (noun <= limit && verb <= limit) {
	let intcodes = [...initialIntcodes] // reset the array every time
	intcodes[1] = noun
	intcodes[2] = verb

	for (i = 0; i < intcodes.length; i += 4) {
		const opCode = intcodes[i]
		const firstPosition = intcodes[i + 1]
		const secondPosition = intcodes[i + 2]
		const resultsPosition = intcodes[i + 3]

		let result

		if (opCode === 1) result = intcodes[firstPosition] + intcodes[secondPosition]
		else if (opCode === 2) result = intcodes[firstPosition] * intcodes[secondPosition]
		else if (opCode === 99) {
			break
		}
		intcodes[resultsPosition] = result
		if (intcodes[0] === expectedOutput) {
			console.log(`RESULT FOUND! ${noun}${verb}`)
		}
	}

	if (noun === limit) {
		noun = 0
		verb = verb + 1
	} else noun++
}
