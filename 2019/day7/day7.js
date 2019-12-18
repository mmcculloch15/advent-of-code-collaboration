const fs = require('fs')
const Combinatorics = require('js-combinatorics')

const intcodes = fs
	.readFileSync('input.txt')
	.toString()
	.split(',')
	.map(value => Number(value))

let amplifiers = []

// must return back a result, that the while loop will set at the end if necessary
const determineOperationResult = (opCode, modes, parameters, ampIndex) => {
	let result = 0
	if (opCode === '1') {
		if (modes[0] === 0) result += amplifiers[ampIndex][parameters[0]]
		else if (modes[0] === 1) result += parameters[0]
		if (modes[1] === 0) result += amplifiers[ampIndex][parameters[1]]
		else if (modes[1] === 1) result += parameters[1]
	} else if (opCode === '2') {
		result = 1
		if (modes[0] === 0) result *= amplifiers[ampIndex][parameters[0]]
		else if (modes[0] === 1) result *= parameters[0]
		if (modes[1] === 0) result *= amplifiers[ampIndex][parameters[1]]
		else if (modes[1] === 1) result *= parameters[1]
	} else if (opCode === '5' || opCode === '6') {
		let num1, num2

		if (modes[0] === 0) num1 = amplifiers[ampIndex][parameters[0]]
		else if (modes[0] === 1) num1 = parameters[0]
		if (modes[1] === 0) num2 = amplifiers[ampIndex][parameters[1]]
		else if (modes[1] === 1) num2 = parameters[1]

		if (opCode === '5') {
			if (num1 !== 0) result = num2
			else result = null
		} else if (opCode === '6') {
			if (num1 === 0) result = num2
			else result = null
		}
		////console.log(`num1! ${num1} num2! ${num2}`)
	} else if (opCode === '7' || opCode === '8') {
		let num1, num2
		if (modes[0] === 0) num1 = amplifiers[ampIndex][parameters[0]]
		else if (modes[0] === 1) num1 = parameters[0]
		if (modes[1] === 0) num2 = amplifiers[ampIndex][parameters[1]]
		else if (modes[1] === 1) num2 = parameters[1]

		if (opCode === '7') {
			if (num1 < num2) result = 1
			else result = 0
		} else if (opCode === '8') {
			if (num1 === num2) result = 1
			else result = 0
		}
	}
	return result
}

const runProgram = (phase, input = 0, ampIndex, i = 0) => {
	//console.log(`PHASE ${phase} INPUT ${input} i ${i}`)
	let output
	let indexIncrement
	while (i < amplifiers[ampIndex].length) {
		let opCodeString = String(amplifiers[ampIndex][i])
		let opCode = String(opCodeString).slice(-1) // grab the last digit only
		let modes = []
		let parameters = []
		////console.log(`OPCODE ${opCode} ampIndex ${ampIndex} i ${i}`)
		if (opCode === '1' || opCode === '2' || opCode === '7' || opCode === '8') {
			// 4 index instructions
			parameters[0] = amplifiers[ampIndex][i + 1]
			parameters[1] = amplifiers[ampIndex][i + 2]
			parameters[2] = amplifiers[ampIndex][i + 3]
			indexIncrement = 4
			modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
			modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
			modes[2] = Number(opCodeString.charAt(opCodeString.length - 5)) || 0
		} else if (opCode === '3' || opCode === '4') {
			// 2 index instructions
			parameters[0] = amplifiers[ampIndex][i + 1]
			modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
			indexIncrement = 2
		} else if (opCode === '5' || opCode === '6') {
			parameters[0] = amplifiers[ampIndex][i + 1]
			parameters[1] = amplifiers[ampIndex][i + 2]
			modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
			modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
			indexIncrement = 0 //we will move this index as part of the operation resolution
		}

		let result
		if (opCode === '1' || opCode === '2' || opCode === '7' || opCode === '8') {
			result = determineOperationResult(opCode, modes, parameters, ampIndex)
			amplifiers[ampIndex][parameters[2]] = result
		} else if (opCode === '3') {
			if (i === 0 && phase) amplifiers[ampIndex][parameters[0]] = Number(phase)
			else amplifiers[ampIndex][parameters[0]] = Number(input)
			////console.log(`THE VALUE SET IN OPCODE 3 IS ${amplifiers[ampIndex][parameters[0]]}`)
		} else if (opCode === '4') {
			if (modes[0] === 0) output = String(amplifiers[ampIndex][parameters[0]])
			else if (modes[0] === 1) output = String(parameters[0])
			break
		} else if (opCode === '5' || opCode === '6') {
			const res = determineOperationResult(opCode, modes, parameters, ampIndex)
			if (res) i = res
			else i += 3
		} else if (opCode === '9') {
			output = 'halt'
			break
		}

		i += indexIncrement
		if (i >= amplifiers[ampIndex].length) i = 0
	}
	i += indexIncrement //when we break, ensure this is still done
	if (i >= amplifiers[ampIndex].length) i = 0
	return { output, i }
}

//change amplifiers[ampIndex] back to intcodes in order to get this to run on its own
function part1() {
	const permutations = Combinatorics.permutation([0, 1, 2, 3, 4])

	let bestResult = 0
	while ((permutation = permutations.next())) {
		let signal = []
		let input = 0
		signal = permutation.map(phase => {
			let output = runProgram(phase, input, ampIndex, i)
			input = output
			return output
		})
		const output = Number(signal.pop())
		if (bestResult < output) bestResult = output
	}
}

function part2() {
	const permutations = Combinatorics.permutation([5, 6, 7, 8, 9])
	const NUM_AMPLIFIERS = 5
	let bestResult = 0

	while ((permutation = permutations.next())) {
		//reset the amplifiers for every permutation
		amplifiers = []
		for (let idx = 0; idx < NUM_AMPLIFIERS; idx++) {
			amplifiers.push([...intcodes])
		}

		let currentAmp = 0
		let output, i
		let ampIndices = [0, 0, 0, 0, 0]
		let input = 0

		//run the first time with phases
		permutation.map(phase => {
			;({ output, i } = runProgram(phase, input, currentAmp))
			input = output
			ampIndices[currentAmp] = i
			if (currentAmp === NUM_AMPLIFIERS - 1) currentAmp = 0
			else currentAmp++
			return output
		})

		//keep looping with phase = null until 99 is hit
		while (output != 'halt') {
			;({ output, i } = runProgram(null, input, currentAmp, ampIndices[currentAmp]))
			if (output != 'halt') input = output
			ampIndices[currentAmp] = i
			if (currentAmp === NUM_AMPLIFIERS - 1) currentAmp = 0
			else currentAmp++
		}

		if (Number(input) > bestResult) bestResult = Number(input) //need the last input
	}
	console.log(`Best Result? ${bestResult}`)
}

part2()
