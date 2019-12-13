const fs = require('fs')

const inputs = fs
	.readFileSync('test.txt')
	.toString()
	.split('\n')

const xLength = inputs[0].length
const yLength = inputs.length

const asteroids = []

inputs.map((row, y) => {
	row.split('').map((space, x) => {
		if (space === '#') asteroids.push({ x, y, count: 0 })
	})
})

//y - y1 = m(x - x1)
//0 = m(x - x1) -y + y1
const isAsteroidInLine = (current, asteroid, slope) => {
	const yChange = asteroid.y - current.y
	const xChange = asteroid.x - current.x
	//const result = slope * current.x - slope * asteroid.x - current.y + asteroid.y
	const result = slope * xChange + yChange
	console.log(`xChange: ${xChange} yChange: ${yChange} slope: ${slope}`)
	//console.log(`RESULT ${result}`)
	if (result < 1 && result > -1) console.log(result)

	//console.log(`${slope} ${xChange} ${yChange}`)
	if (result === 0) return true

	return false
}

const calculateSlope = (point1, point2) => (point2.x - point1.x) / (point2.y - point1.y)

const removeAsteroidFromArray = (asteroids, current) =>
	asteroids.filter(asteroid => !(asteroid.x === current.x && asteroid.y === current.y))

for (let i = 0; i < asteroids.length; i++) {
	const current = asteroids[i]
	const otherAsteroids = removeAsteroidFromArray(asteroids, current)
	otherAsteroids.forEach((asteroid, idx) => {
		const otherAsteroidsCopy = [...otherAsteroids]
		const slope = calculateSlope(current, asteroid)

		const possibleAsteroids = removeAsteroidFromArray(otherAsteroidsCopy, asteroid)
		const valid = possibleAsteroids.reduce((acc, ast) => {
			if (acc === false) return acc
			else {
				return !isAsteroidInLine(current, ast, slope)
			}
		}, true)
		if (valid) current.count++
	})
	break
}

console.log(asteroids)

//Start with an asteroid and pick another asteroid (repeat for every asteroid pair)
// Find slope of the point and line
// plot y - y1 = m(x - x1)
// isolate y to get the linear equation for the line
// Put all other asteroids into the formula and see if it balances
// If ANY other point balances, the asteroid cannot be seen
// If NONE do, it's +1 sight for the initial asteroid
