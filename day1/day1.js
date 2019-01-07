const fs = require('fs')

const changes = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')

//console.log(changes)

//javascript

//TODO: turn string into number


function part1() {
  let frequency = 0
  changes.map(change => {
    frequency += parseInt(change)
  })
  return frequency
}


function part2() {
  let frequency = 0
  let total = []
  let found = false
  while (found == false) {
    changes.map(change => {
      frequency += parseInt(change)
      if (total.includes(frequency) === true) {
        console.log(`Found! ${frequency}`)
        found = true
      }
      total.push(frequency)
      // if (total.filter(frequency)) { console.log('find the number is match!') }

    })
  }

}

//[]
//[0]   /


part2()

