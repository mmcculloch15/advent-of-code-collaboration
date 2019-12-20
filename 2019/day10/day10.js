const fs = require('fs')

const inputs = fs
	.readFileSync('test2.txt')
	.toString()
	.split('\n')

const xLength = inputs[0].length
const yLength = inputs.length

const asteroids = []

inputs.map((row, y) => {
	row.split('').map((space, x) => {
		if (space === '#') asteroids.push({ x: y, y: x, count: 0 })
	})
})

//y - y1 = m(x - x1)
//0 = m(x - x1) -y + y1
//y = mx + b
//y-mx = b
//TODO: Just check unique slopes?
const isAsteroidInLine = (current, asteroid, slope) => {
	const b = current.y - slope * current.x
	// const yChange = asteroid.y - current.y
	// const xChange = asteroid.x - current.x
	let result
	if (slope === Infinity || slope === -Infinity) {
		return current.x === asteroid.x
	} else {
		//result = slope * current.x - slope * asteroid.x - current.y + asteroid.y
		if (asteroid.y === slope * asteroid.x + b) {
			// console.log(current)
			// console.log(asteroid)
			// console.log(b, slope)
			return true
		}
	}

	return false
}

const isAsteroidBetween = (asteroid, start, end) => {
	// console.log(start)
	// console.log(end)
	// console.log(asteroid)
	// console.log('=======')

	if (
		((start.x <= asteroid.x && asteroid.x <= end.x) ||
			(start.x >= asteroid.x && asteroid.x >= end.x)) &&
		((start.y <= asteroid.y && asteroid.y <= end.y) ||
			(start.y >= asteroid.y && asteroid.y >= end.y))
	) {
		return true
	} else return false
}

const calculateSlope = (point1, point2) => (point2.y - point1.y) / (point2.x - point1.x)

const removeAsteroidFromArray = (asteroids, current) =>
	asteroids.filter(asteroid => !(asteroid.x === current.x && asteroid.y === current.y))

const findAsteroidsInBetween = (asteroids, start, end) =>
	asteroids.filter(asteroid => isAsteroidBetween(asteroid, start, end))

for (let i = 0; i < asteroids.length; i++) {
	const start = asteroids[i]
	const otherAsteroids = removeAsteroidFromArray(asteroids, start)
	otherAsteroids.forEach((end, idx) => {
		// console.log(`Start`, start)
		// console.log(`End`, end)
		const otherAsteroidsCopy = [...otherAsteroids]
		const slope = calculateSlope(start, end)

		const possibleAsteroids = removeAsteroidFromArray(otherAsteroidsCopy, end)
		const asteroidsToCheck = findAsteroidsInBetween(possibleAsteroids, start, end)
		let slopes = []
		let valid = true
		possibleAsteroids.map(asteroid => {
			slopes.push(calculateSlope(start, asteroid))
		})
		console.log(slopes)
		if (slopes.length === new Set(slopes).size) valid = true
		else valid = false
		// const valid = asteroidsToCheck.reduce((acc, ast) => {
		// 	if (acc === false) return acc
		// 	else {
		// 		return !isAsteroidInLine(start, ast, slope)
		// 	}
		// }, true)
		if (valid) start.count++
		else {
			//console.log(`FAIL!`, current, asteroid, slope)
		}
	})
}

const result = asteroids.reduce(
	(acc, asteroid) => {
		if (asteroid.count > acc.count) return asteroid
		else return acc
	},
	{ count: 0 }
)

//console.log(asteroids.filter(asteroid => asteroid.count >= 210))
//console.log(`RESULT`, result)
console.log(asteroids)
//Start with an asteroid and pick another asteroid (repeat for every asteroid pair)
// Find slope of the point and line
// plot y - y1 = m(x - x1)
// isolate y to get the linear equation for the line
// Put all other asteroids into the formula and see if it balances
// If ANY other point balances, the asteroid cannot be seen
// If NONE do, it's +1 sight for the initial asteroid
