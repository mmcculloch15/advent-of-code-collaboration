const fs = require('fs')

const boxIds = fs
  .readFileSync('./input.txt')  //test input for now
  .toString()
  .split('\n')

//Data will be in shape: abcdef

//Step 1: Deal with a particular ID
//Step 2: Count the occurrences of each letter

let occurTwice = 0
let occurThrice = 0

//initial state: acc = 0
//first element: acc = 0, currentValue = 1, set acc = 0 + 1
//ssecond element: acc = 1, currentValue = 2, set acc = 1 + 2
//third element: acc = 3, currentValue = 3, set acc = 3 + 3

function part1() {
  boxIds.map((id => {
    //Break id down into array of characters
    const result = id.split('').reduce((acc, currentValue) => {
      //two outcomes of this reducer
      //character has occurred
      if (Object.keys(acc).includes(currentValue)) {
        acc[currentValue]++
      }
      //character hasn't occurred
      else {
        acc[currentValue] = 1
      }
      return acc
    }, {})

    if (Object.values(result).includes(2)) occurTwice++
    if (Object.values(result).includes(3)) occurThrice++
  }))
  return occurThrice * occurTwice
}

function part2() {


  for (let i = 0; i < boxIds[0].length; i++) {
    //Step 1: slice out a character from each ID
    let sliceIds = boxIds.map(id => {
      return id.slice(0, i) + id.slice(i + 1, boxIds[0].length)
    })

    //Step 2: determine if there is a duplicate element in the resulting array of IDs

    //If the lengths of these are not the same, then there is a duplicate after we've sliced out the i'th character
    if ((new Set(sliceIds)).size != boxIds.length) {
      sliceIds.sort()
      for (let i = 0; i < sliceIds.length; i++) {
        if (sliceIds[i] == sliceIds[i + 1]) {
          return sliceIds[i]
        }
      }
    }
  }


  //Step 3: If yes, find the matching IDs and return the value


}


console.log(part2())
