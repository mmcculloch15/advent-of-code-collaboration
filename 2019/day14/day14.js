const fs = require('fs')

const reactions = fs
  .readFileSync('input.txt')
  .toString()
  .split('\n')

// Need to loop through and represent all parts of the recipe as ORE

const ore = []

let fuel

// ? Maybe we can classify each element by its complexity, because we might need to convert all level 3s before we can convert level 2s, then level 1s etc.
const elements = []

// Maybe we just continuously look at fuel, until it is only made up of chemicals in oreElements.
// If it isn't, try to break down the inputs further. 1 time through the loop.  Skipping oreElements

reactions.map(reaction => {
  const [leftSide, rightSide] = reaction.split('=>')
  const [qty, chemical] = rightSide.trim().split(' ')
  if (leftSide.includes('ORE')) {
    ore.push({
      oreQty: leftSide.trim().split(' ')[0],
      result: {
        qty: Number(qty),
        chemical,
      },
    })
  } else {
    const inputs = leftSide.split(',')
    const reactionInput = inputs.map(input => {
      const [lQty, lChemical] = input.trim().split(' ')
      return {
        qty: Number(lQty),
        chemical: lChemical,
      }
    })

    if (rightSide.includes('FUEL')) {
      fuel = {
        output: {
          qty: Number(qty),
          chemical,
        },
        inputs: reactionInput,
      }
    } else {
      elements.push({
        output: {
          qty: Number(qty),
          chemical,
        },
        inputs: reactionInput,
      })
    }
  }
})

console.log(`FUEL`, fuel)

const oreElements = ore.map(elem => elem.result.chemical)

const isBrokenDownCompletely = () => {
  const cannotBeConvertedToORE = fuel.inputs.filter(input => !oreElements.includes(input.chemical))
  return cannotBeConvertedToORE.length === 0
}

// loop until fuel.inputs is fully represented in elements from ore
let loop = true
while (loop) {
  let refinedInputs = []
  let excessOutputs = []
  for (let i = 0; i < fuel.inputs.length; i++) {
    const { qty: fuelQty, chemical: fuelChemical } = fuel.inputs[i]
    // console.log(`FUEL CHEMICAL`, fuelChemical)

    // find the object with output = chemical
    const outputChemical = elements.find(elem => elem.output.chemical === fuelChemical)

    if (outputChemical) {
      console.log(`FUEL NEEDS ${fuelQty} of ${outputChemical.output.chemical}`)
      const outputQty = outputChemical.output.qty
      let multiple = fuelQty / outputQty
      const excessPercent = multiple % 1
      if (excessPercent !== 0) {
        multiple += 1
        const excess = Math.trunc(excessPercent * outputQty)
        console.log(`EXCESS IS ${excess}`)
        excessOutputs.push({
          chemical: fuelChemical,
          excess,
        })
      }

      multiple = Math.trunc(multiple)
      // if it exists, it is not broken down as low as it could be
      // Take its inputs, multiply each by qty, then put them into the refinedInputs array
      outputChemical.inputs.map(input => {
        const { qty, chemical } = input
        const generated = qty * multiple

        refinedInputs.push({
          qty: generated,
          chemical,
        })
        console.log(`Need ${qty} x ${multiple} of ${chemical} = ${qty * multiple}`)
      })
    } else refinedInputs.push(fuel.inputs[i])
    // replace fuel.inputs with refinedInputs, which should grow the list with all the broken up elements.  Ex. instad of 2AB, it should have 6 A and 8 B
  }
  console.log(`EXCESS Outputs`, excessOutputs)
  // console.log(`PRE-REFINED INPUTS `, refinedInputs)

  // sum up the refinedInputs?
  refinedInputs = refinedInputs.reduce((acc, input) => {
    let { qty: inputQty, chemical: inputChemical } = input
    let excessVal = 0
    const foundChemical = acc.find(elem => elem.chemical === inputChemical)
    const excessChemical = excessOutputs.find(elem => elem.chemical === inputChemical)
    if (excessChemical) excessVal = excessChemical.excess
    console.log(`CHEMICAL ${inputChemical} excess: `, excessVal)
    if (foundChemical) {
      foundChemical.qty += inputQty
    } else {
      acc.push({
        qty: inputQty - excessVal,
        chemical: inputChemical,
      })
    }
    return acc
  }, [])

  console.log(`SUMMED REFINED INPUTS `, refinedInputs)

  fuel.inputs = refinedInputs
  if (isBrokenDownCompletely()) loop = false
}

console.log(fuel)

const summed = fuel.inputs.reduce((acc, input) => {
  const { qty, chemical } = input
  if (acc[chemical]) acc[chemical] += qty
  else acc[chemical] = qty
  return acc
}, {})

const oreNeeded = ore.reduce((acc, elem) => {
  const { oreQty, result } = elem
  const { qty: resultQty, chemical: resultChemical } = result
  let multiple = summed[resultChemical] / resultQty
  if (multiple % 1 !== 0) multiple++
  multiple = Math.trunc(multiple)
  acc += oreQty * multiple
  return acc
}, 0)

console.log(summed)
// console.log(JSON.stringify(ore, null, 2))
console.log(oreNeeded)

// NVRVD: 19877 actual: 19182 //5 too many
// JNWZP: 1728
// VJHF: 59136  actual: 58432 //4 too many VJHF
// MNCFX: 102225‬  actual: 101355  //6 too many MNCFX

// 2269 over
