const fs = require('fs')

const intcodes = fs
	.readFileSync('input.txt')
	.toString()
	.split(',')
	.map(value => Number(value))

// must return back a result, that the while loop will set at the end if necessary
const determineOperationResult = (opCode, modes, parameters) => {
	let result = 0
	if (opCode === '01') {
		if (modes[0] === 0) result += intcodes[parameters[0]]
		else if (modes[0] === 1) result += parameters[0]
		if (modes[1] === 0) result += intcodes[parameters[1]]
		else if (modes[1] === 1) result += parameters[1]
	} else if (opCode === '02') {
		result = 1
		if (modes[0] === 0) result *= intcodes[parameters[0]]
		else if (modes[0] === 1) result *= parameters[0]
		if (modes[1] === 0) result *= intcodes[parameters[1]]
		else if (modes[1] === 1) result *= parameters[1]
	} else if (opCode === '05' || opCode === '06') {
		let num1, num2

		if (modes[0] === 0) num1 = intcodes[parameters[0]]
		else if (modes[0] === 1) num1 = parameters[0]
		if (modes[1] === 0) num2 = intcodes[parameters[1]]
		else if (modes[1] === 1) num2 = parameters[1]

		if (opCode === '05') {
			if (num1 !== 0) result = num2
			else result = null
		} else if (opCode === '06') {
			if (num1 === 0) result = num2
			else result = null
		}
		console.log(`num1! ${num1} num2! ${num2}`)
	} else if (opCode === '07' || opCode === '08') {
		let num1, num2
		if (modes[0] === 0) num1 = intcodes[parameters[0]]
		else if (modes[0] === 1) num1 = parameters[0]
		if (modes[1] === 0) num2 = intcodes[parameters[1]]
		else if (modes[1] === 1) num2 = parameters[1]

		if (opCode === '07') {
			if (num1 < num2) result = 1
			else result = 0
		} else if (opCode === '08') {
			if (num1 === num2) result = 1
			else result = 0
		}
		console.log(`num1! ${num1} num2! ${num2}`)
	}
	console.log(`result ${result}`)
	return result
}

let i = 0
while (i < intcodes.length) {
	let opCodeString = String(intcodes[i])
	console.log(`OPCODE STRING ${opCodeString}`)
	let indexIncrement
	let opCode = String(opCodeString)
		.slice(opCodeString.length - 2)
		.padStart(2, '0')
	console.log(`OPCODE STRING ${opCodeString}`)
	let modes = []
	let parameters = []
	if (opCode === '01' || opCode === '02' || opCode === '07' || opCode === '08') {
		// 4 index instructions
		parameters[0] = intcodes[i + 1]
		parameters[1] = intcodes[i + 2]
		parameters[2] = intcodes[i + 3]
		indexIncrement = 4
		modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
		modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
		modes[2] = Number(opCodeString.charAt(opCodeString.length - 5)) || 0
	} else if (opCode === '03' || opCode === '04') {
		// 2 index instructions
		parameters[0] = intcodes[i + 1]
		modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
		indexIncrement = 2
	} else if (opCode === '05' || opCode === '06') {
		parameters[0] = intcodes[i + 1]
		parameters[1] = intcodes[i + 2]
		modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
		modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
		indexIncrement = 0 //we will move this index as part of the operation resolution
	}

	console.log(`opcode ${opCode} modes ${modes} parameters ${parameters} i ${i} `)
	let result
	if (opCode === '01' || opCode === '02' || opCode === '07' || opCode === '08') {
		result = determineOperationResult(opCode, modes, parameters)
	} else if (opCode === '03') {
		intcodes[parameters[0]] = 5 // Seems fine to hardcode this value instead of asking for user input
	} else if (opCode === '04') {
		if (modes[0] === 0)
			console.log(`DIAGNOSTIC OUTPUT: ${String(intcodes[parameters[0]])}`)
		else if (modes[0] === 1) console.log(`DIAGNOSTIC OUTPUT: ${String(parameters[0])}`)
	} else if (opCode === '05' || opCode === '06') {
		const res = determineOperationResult(opCode, modes, parameters)
		if (res) i = res
		else i += 3
	} else if (opCode === '99') {
		break
	}

	// opCode 3 and 4 are handled in the if blocks above
	if (opCode === '01' || opCode === '02' || opCode === '07' || opCode === '08')
		intcodes[parameters[2]] = result

	i += indexIncrement
}
