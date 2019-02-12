const fs = require('fs')

const coordinates = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')
  .map(coordinate => coordinate.replace(/\s/g, '').split(','))

//sort the coordinates from lowest to highest, for both x and y?

//The default sorting method of Array.sort is to sort alphabetically.  This method will get passed in
//so that they will be sorted numerically instead.
//if a is less than b, then they stay in place.  if b is less than a, b will be moved before a in the array
const sortNumbers = (a, b) => a - b

//Find the largest values of X and Y and add one, so that we can ensure that their associated points can be added to the grid
const largestX =
  parseInt(
    coordinates
      .map(coordinate => coordinate[0])
      .sort(sortNumbers)
      .pop()
  ) + 1

const largestY =
  parseInt(
    coordinates
      .map(coordinate => coordinate[1])
      .sort(sortNumbers)
      .pop()
  ) + 1

//initialize an array that is largest(x) and largest(y)
//The first Array.from() will create the columns, and the second will create the rows
const grid = Array.from({ length: largestY }, () => Array.from({ length: largestX }).fill('.'))

//Create an array reference for each of the points of interest we are going to compare -all- points to
//this array could have a counter that we increment each time we find that it is the cloest to a particular point?
const points = coordinates.map((coordinate, i) => ({
  name: `point${i}`,
  x: coordinate[0],
  y: coordinate[1],
  counter: 0,
}))

const findClosestPointOfInterest = (x, y) => {
  //for each point, do the manhattan formula between its coordinates and the ones passed in.  Save the lowest
  const result = points.reduce(
    (smallestDistance, point) => {
      let distance = Math.abs(x - point.x) + Math.abs(y - point.y)
      if (distance < smallestDistance.value) {
        //unique lowest value has been found, so ensure duplicate is false and update the accumulator
        return {
          name: point.name,
          value: distance,
          duplicate: false,
        }
      } else if (distance === smallestDistance.value) {
        //if the current difference equals the lowest found so far, set duplicate to true, so we can discount it
        //if it is still the lowest value at the end
        return {
          name: point.name,
          value: distance,
          duplicate: true,
        }
      }
      return smallestDistance
    },
    { name: '', value: '999999', duplicate: false } //default accumulator value for the reduce function
  )

  //set this to a value we don't care about if a duplicate has been found.  Else return the point name
  if (result.duplicate) return '.'
  else return result.name
}

const findTotalDistanceFromPoints = (x, y) => {
  return points.reduce((totalDistance, point) => {
    let distance = Math.abs(x - point.x) + Math.abs(y - point.y)
    return totalDistance + distance
  }, 0)
}

const part1 = () => {
  //For each element in our grid, calculate its closest POI and set the name as its value
  for (let i = 0; i < largestY; i++) {
    for (let j = 0; j <= largestX; j++) {
      grid[i][j] = findClosestPointOfInterest(i, j) //assign [0, 0] the value of 'point1'
      const res = points.find(point => {
        //we could put this in findClosestPointOfInterest() maybe? Find the appropriate POI so we can update its counter
        return point.name === grid[i][j]
      })
      if (res) {
        res.counter++ //If a match is found, increment its counter by 1
      }
    }
  }

  //These functions will grab the outer edges of the grid and set their closest POIs to 0, as they are infinite

  //Use a set because it will handle duplicates for us automatically
  let infinitePointName = new Set()
  grid.map(column => {
    infinitePointName.add(column[0])
    infinitePointName.add(column[column.length - 1])
  })

  grid[0].map(point => {
    infinitePointName.add(point)
  })
  grid[grid.length - 1].map(point => {
    infinitePointName.add(point)
  })

  //For each point identified as being infinite, set their counters to 0
  for (item of infinitePointName) {
    const res = points.find(point => {
      return point.name === item
    })
    if (res) res.counter = 0
  }

  //sort from lowest to highest and pop the highest value from the array, done!
  const answer = points
    .map(point => point.counter)
    .sort(sortNumbers)
    .pop()

  console.log(`Answer! ${answer}`)
}

const part2 = () => {
  for (let i = 0; i < largestY; i++) {
    for (let j = 0; j < largestX; j++) {
      grid[i][j] = findTotalDistanceFromPoints(i, j)
    }
  }

  const result = grid
    .map(row => {
      return row.filter(cell => cell < 10000 && typeof cell !== 'undefined').length
    })
    .reduce((sum, value) => (sum += value), 0)

  console.log(`Answer! ${result}`)
}

part1()
