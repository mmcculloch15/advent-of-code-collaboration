const fs = require('fs')

const intcodes = fs
	.readFileSync('input.txt')
	.toString()
	.split(',')
	.map(value => Number(value))

const getValue = (mode, parameter) => {
	if (mode === 0) return intcodes[parameter] || 0
	else if (mode === 1) return parameter
	else if (mode === 2) {
		relativeIndex = relativeBase + parameter
		if (intcodes[relativeIndex] == undefined) intcodes[relativeIndex] = 0
		return intcodes[relativeIndex] || 0
	}
}

// must return back a result, that the while loop will set at the end if necessary
const determineOperationResult = (opCode, modes, parameters) => {
	let number1, number2
	number1 = getValue(modes[0], parameters[0])
	number2 = getValue(modes[1], parameters[1])
	let result = 0
	if (opCode === '01') result = number1 + number2
	else if (opCode === '02') result = number1 * number2
	else if (opCode === '05') result = number1 !== 0 ? number2 : null
	else if (opCode === '06') result = number1 === 0 ? number2 : null
	else if (opCode === '07') result = number1 < number2 ? 1 : 0
	else if (opCode === '08') result = number1 === number2 ? 1 : 0
	//console.log(`result ${result}`)
	return result
}

const BOOST_INPUT = 2 //change to 1 for part 1

const processInstruction = (i, input) => {
	let opCodeString = String(intcodes[i])
	let opCode = String(opCodeString)
		.slice(opCodeString.length - 2)
		.padStart(2, '0') //ensure that we always have a 2 digit opCode

	let indexIncrement
	let modes = []
	let parameters = []
	let output = ''

	//console.log(`OPCODE STRING ${opCodeString}`)
	if (opCode === '01' || opCode === '02' || opCode === '07' || opCode === '08') {
		// 4 index instructions
		parameters[0] = intcodes[i + 1]
		parameters[1] = intcodes[i + 2]
		parameters[2] = intcodes[i + 3]
		indexIncrement = 4
		modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
		modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
		modes[2] = Number(opCodeString.charAt(opCodeString.length - 5)) || 0
	} else if (opCode === '03' || opCode === '04' || opCode === '09') {
		// 2 index instructions
		parameters[0] = intcodes[i + 1]
		modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
		indexIncrement = 2
	} else if (opCode === '05' || opCode === '06') {
		//TODO: Move this to the 1,2,7,8 block?
		parameters[0] = intcodes[i + 1]
		parameters[1] = intcodes[i + 2]
		modes[0] = Number(opCodeString.charAt(opCodeString.length - 3)) || 0
		modes[1] = Number(opCodeString.charAt(opCodeString.length - 4)) || 0
		indexIncrement = 0 //we will move this index as part of the operation resolution
	}

	// console.log(
	// 	`opcode ${opCode} modes ${modes} parameters ${parameters} i ${i} relativeBase ${relativeBase}`
	// )
	let result
	if (opCode === '01' || opCode === '02' || opCode === '07' || opCode === '08') {
		result = determineOperationResult(opCode, modes, parameters)
	} else if (opCode === '03') {
		if (modes[0] === 0) intcodes[parameters[0]] = BOOST_INPUT
		else if (modes[0] === 2) intcodes[relativeBase + parameters[0]] = BOOST_INPUT
		else console.log(`Unexpected mode for OpCode ${opCode}`)
	} else if (opCode === '04') {
		console.log(`*** Output ${String(getValue(modes[0], parameters[0]))} ***`)
		output = getValue(modes[0], parameters[0])
	} else if (opCode === '05' || opCode === '06') {
		const res = determineOperationResult(opCode, modes, parameters)
		if (res != null) i = res
		else i += 3
	} else if (opCode === '09') {
		relativeBase += getValue(modes[0], parameters[0])
		//console.log(`RELATIVE BASE IS NOW ${relativeBase}`)
	} else if (opCode === '99') {
		output = 'halt'
	}

	// opCode 3 and 4 are handled in the if blocks above
	if (opCode === '01' || opCode === '02' || opCode === '07' || opCode === '08') {
		if (modes[2] === 0) intcodes[parameters[2]] = result
		else if (modes[2] === 2) intcodes[relativeBase + parameters[2]] = result
		else console.log(`Unexpected mode for OpCode ${opCode}`)
	}
	return { output, result, indexIncrement, i }
}

let relativeBase = 0
let i = 0
let input = 0
const grid = [[]]
const robot = { x: 0, y: 0, direction: 'up' }
while (i < intcodes.length) {

	//INPUTS:  0 if robot is on black panel, 1 if white
	/* Outputs
    First: output a value indicating the color to paint the panel.  0 means paint it black, 1 means paint it white
    Second Output: value indicating the direction the robot should turn.  0 is turn left 90deg, 1 is turn right 90deg

    THEN: moves forward one space
  */
  const data = processInstruction(i, getCurrentTileColor())
  
  const { output, result, indexIncrement } = data

	if (output === 'halt') break
	else if (i !== data.i) i = data.i
	else i += indexIncrement
}

const moveRobot = () => {
  if(direction === 'up') robot.y--
  else if(direction === 'down') robot.y++
  else if(direction === 'left') robot.x--
  else if(direction === 'right') robot.x++
}

const getCurrentTileColor = () => return grid[robot.x][robot.y]
