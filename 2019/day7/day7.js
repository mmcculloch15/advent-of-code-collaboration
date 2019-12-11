const fs = require('fs')
const Combinatorics = require('js-combinatorics')

const intcodes = fs
	.readFileSync('input.txt')
	.toString()
	.split(',')
	.map(value => Number(value))

// must return back a result, that the while loop will set at the end if necessary
const determineOperationResult = (opCode, modes, parameters) => {
	let result = 0
	if (opCode === '1') {
		if (modes[0] === 0) result += intcodes[parameters[0]]
		else if (modes[0] === 1) result += parameters[0]
		if (modes[1] === 0) result += intcodes[parameters[1]]
		else if (modes[1] === 1) result += parameters[1]
	} else if (opCode === '2') {
		result = 1
		if (modes[0] === 0) result *= intcodes[parameters[0]]
		else if (modes[0] === 1) result *= parameters[0]
		if (modes[1] === 0) result *= intcodes[parameters[1]]
		else if (modes[1] === 1) result *= parameters[1]
	} else if (opCode === '5' || opCode === '6') {
		let num1, num2

		if (modes[0] === 0) num1 = intcodes[parameters[0]]
		else if (modes[0] === 1) num1 = parameters[0]
		if (modes[1] === 0) num2 = intcodes[parameters[1]]
		else if (modes[1] === 1) num2 = parameters[1]

		if (opCode === '5') {
			if (num1 !== 0) result = num2
			else result = null
		} else if (opCode === '6') {
			if (num1 === 0) result = num2
			else result = null
		}
		console.log(`num1! ${num1} num2! ${num2}`)
	} else if (opCode === '7' || opCode === '8') {
		let num1, num2
		if (modes[0] === 0) num1 = intcodes[parameters[0]]
		else if (modes[0] === 1) num1 = parameters[0]
		if (modes[1] === 0) num2 = intcodes[parameters[1]]
		else if (modes[1] === 1) num2 = parameters[1]

		if (opCode === '7') {
			if (num1 < num2) result = 1
			else result = 0
		} else if (opCode === '8') {
			if (num1 === num2) result = 1
			else result = 0
		}
		console.log(`num1! ${num1} num2! ${num2}`)
	}
	console.log(`result ${result}`)
	return result
}

const runProgram = (phase, input = 0) => {
	console.log(`PHASE ${phase} INPUT ${input}`)
	let i = 0
	let output
	while (i < intcodes.length) {
		let opCodeString = String(intcodes[i])
		let indexIncrement
		let opCode = String(opCodeString).slice(-1) // grab the last digit only
		let modes = []
		let parameters = []
		if (opCode === '1' || opCode === '2' || opCode === '7' || opCode === '8') {
			// 4 index instructions
			parameters[0] = intcodes[i + 1]
			parameters[1] = intcodes[i + 2]
			parameters[2] = intcodes[i + 3]
			indexIncrement = 4
			modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
			modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
			modes[2] = Number(opCodeString.charAt(opCodeString.length - 5)) || 0
		} else if (opCode === '3' || opCode === '4') {
			// 2 index instructions
			parameters[0] = intcodes[i + 1]
			modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
			indexIncrement = 2
		} else if (opCode === '5' || opCode === '6') {
			parameters[0] = intcodes[i + 1]
			parameters[1] = intcodes[i + 2]
			modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
			modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
			indexIncrement = 0 //we will move this index as part of the operation resolution
		}

		console.log(`opcode ${opCode} modes ${modes} parameters ${parameters} i ${i} `)
		let result
		if (opCode === '1' || opCode === '2' || opCode === '7' || opCode === '8') {
			result = determineOperationResult(opCode, modes, parameters)
		} else if (opCode === '3') {
			if (i === 0) intcodes[parameters[0]] = Number(phase)
			else intcodes[parameters[0]] = Number(input)
			console.log(`THE VALUE SET IN OPCODE 3 IS ${intcodes[parameters[0]]}`)
		} else if (opCode === '4') {
			if (modes[0] === 0) output = String(intcodes[parameters[0]])
			else if (modes[0] === 1) output = String(parameters[0])
		} else if (opCode === '5' || opCode === '6') {
			const res = determineOperationResult(opCode, modes, parameters)
			if (res) i = res
			else i += 3
		} else if (opCode === '9') {
			break
		}

		// opCode 3 and 4 are handled in the if blocks above
		if (opCode === '1' || opCode === '2' || opCode === '7' || opCode === '8') intcodes[parameters[2]] = result
		if (opCode === '4') {
			console.log(`BREAK THE LOOP`)
			break
		}
		i += indexIncrement
	}
	console.log(`OUTPUT IS ${output}`)
	return output
}

const permutations = Combinatorics.permutation([0, 1, 2, 3, 4])

let bestResult = 0
while ((permutation = permutations.next())) {
	console.log(`=====================================RUNNING ${permutation}`)
	let signal = []
	let input = 0
	signal = permutation.map(phase => {
		console.log(`==========NEW PERMUTATION ${phase}`)
		let output = runProgram(phase, input)
		input = output
		return output
	})
	const output = Number(signal.pop())
	if (bestResult < output) bestResult = output
}

console.log(`BEST RESULT ${bestResult}`)
