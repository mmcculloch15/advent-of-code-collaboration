const fs = require('fs')

const claims = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')

let overlaps = 0

function initializeArray() {
  const clothArray = []
  for (i = 0; i < 1000; i++) {
    let row = []
    for (j = 0; j < 1000; j++) {
      row[j] = 0
    }
    clothArray.push(row)
  }
  return clothArray
}

function part1(claims) {
  const clothArray = initializeArray()

  for (claim of claims) {
    claim = claim.split(' ')
    const coordsX = parseInt(claim[2].slice(0, -1).split(',')[0])
    const coordsY = parseInt(claim[2].slice(0, -1).split(',')[1])
    const width = parseInt(claim[3].split('x')[0])
    const height = parseInt(claim[3].split('x')[1])

    for (let x = coordsX; x < coordsX + width; x++) {
      for (let y = coordsY; y < coordsY + height; y++) {
        clothArray[x][y] += 1
        if (clothArray[x][y] == 2) overlaps++
      }
    }
  }
  return overlaps
}

function part2(claims) {
  let uniqueClaims = {}
  const claimArray = initializeArray()

  for (claim of claims) {
    claim = claim.split(' ')
    const number = claim[0]
    uniqueClaims[number] = true
    const coordsX = parseInt(claim[2].slice(0, -1).split(',')[0])
    const coordsY = parseInt(claim[2].slice(0, -1).split(',')[1])
    const width = parseInt(claim[3].split('x')[0])
    const height = parseInt(claim[3].split('x')[1])

    for (let x = coordsX; x < coordsX + width; x++) {
      for (let y = coordsY; y < coordsY + height; y++) {
        currentSquareInch = claimArray[x][y]
        if (currentSquareInch == 0) claimArray[x][y] = number
        else if (currentSquareInch.includes('#')) {
          uniqueClaims[currentSquareInch] = false
          uniqueClaims[number] = false
        }
      }
    }
  }
  return Object.entries(uniqueClaims).find(entry => entry[1] === true)
}

console.log(part2(claims))
