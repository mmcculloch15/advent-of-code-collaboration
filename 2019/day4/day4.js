const rangeStart = 108457
const rangeEnd = 562041

let validPasswords = 0

const hasAscendingNumbers = password =>
  password
    .toString()
    .split('')
    .sort()
    .join() ==
  password
    .toString()
    .split('')
    .join()

const hasExactlyTwoAdjacent = (passwordString, i) => {
  let valid = false
  if (!passwordString[i - 1] || passwordString[i - 1] != passwordString[i]) {
    if (!passwordString[i + 2] || passwordString[i + 2] != passwordString[i]) {
      valid = true
    }
  }
  return valid
}

const hasMatchingAdjacentDigits = password => {
  const passwordString = String(password)

  for (let i = 0; i < passwordString.length - 1; i++) {
    if (passwordString[i] === passwordString[i + 1]) {
      if (hasExactlyTwoAdjacent(passwordString, i)) return true
    }
  }
  return false
}

for (let i = rangeStart; i <= rangeEnd; i++) {
  if (hasAscendingNumbers(i) && hasMatchingAdjacentDigits(i)) {
    validPasswords++
  }
}

console.log(`Answer: ${validPasswords}`)
