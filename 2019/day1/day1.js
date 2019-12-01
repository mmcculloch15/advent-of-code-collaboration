const fs = require('fs')

const fuelArray = fs
	.readFileSync('input.txt')
	.toString()
	.split('\n')

const recursiveFuel = (fuel, subtotal = 0) => {
	const fuelRequired = Math.floor(fuel / 3) - 2
	if (fuelRequired > 0) {
		subtotal += fuelRequired
		return recursiveFuel(fuelRequired, subtotal)
	} else return subtotal
}

//Part 2
const totalFuel = fuelArray.reduce((acc, fuel) => {
	return acc + recursiveFuel(fuel)
}, 0)

console.log(`FINAL ${totalFuel}`)
