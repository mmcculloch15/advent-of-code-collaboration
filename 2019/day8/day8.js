const fs = require('fs')
const util = require('util')

const input = fs.readFileSync('input.txt').toString()

const width = 25
const height = 6
const layerSize = width * height

const regex = new RegExp(`.{${layerSize}}|.{1,2}`, 'g')
const layers = input.match(regex).reverse() // reverse it so we can build the grid from the ground up

const part1 = () => {
  let bestLayer = {
    '0': Infinity,
    '1': Infinity,
    '2': Infinity,
  }
  layers.map(layer => {
    const result = layer.split('').reduce(
      (acc, value) => {
        if (value === '0') acc[0]++
        if (value === '1') acc[1]++
        if (value === '2') acc[2]++
        return acc
      },
      { 0: 0, 1: 0, 2: 0 }
    )
    if (result[0] < bestLayer[0]) bestLayer = result
  })

  console.log(`Answer: ${bestLayer[1] * bestLayer[2]}`)
}

const part2 = () => {
  const result = layers.reduce((acc, layer) => {
    if (acc === []) return layer // set the first layer to the acc immediately
    return layer.split('').map((value, i) => {
      if (value != '2') return value
      return acc[i]
    })
  }, [])

  console.log(util.inspect(result, { maxArrayLength: null }))
  // TODO: Figure out how to display this in a fun way in the terminal!
}

part1()
