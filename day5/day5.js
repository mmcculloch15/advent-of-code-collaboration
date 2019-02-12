const fs = require('fs')

const input = fs.readFileSync('./input.txt').toString()

function checkForReaction(currentCharacter, nextCharacter) {
  return (
    currentCharacter.charCodeAt(0) + 32 === nextCharacter.charCodeAt(0) ||
    currentCharacter.charCodeAt(0) - 32 === nextCharacter.charCodeAt(0)
  )
}

function recursivelyCheckReactions(polymer) {
  let reactionsExist = false

  for (let i = 0; i < polymer.length - 2; i++) {
    if (checkForReaction(polymer[i], polymer[i + 1])) {
      polymer = polymer.substring(0, i) + polymer.substring(i + 2)
      reactionsExist = true
    }
  }

  if (reactionsExist === true) return recursivelyCheckReactions(polymer)
  else return polymer.length
}

function part2() {
  let smallestPolymer

  for (let charCode = 65; charCode <= 90; charCode++) {
    const regex = new RegExp(String.fromCharCode(charCode), 'gi')
    newPolymer = input.replace(regex, '')
    const result = recursivelyCheckReactions(newPolymer)
    if (!smallestPolymer || result < smallestPolymer) smallestPolymer = result
  }
  return smallestPolymer
}

console.log(part2())
