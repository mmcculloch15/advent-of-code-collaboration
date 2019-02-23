const fs = require('fs')

const instructions = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')

const answer = []

//Create 2 capture groups in the regex to capture both relevant characters
const regex = /Step\s(.).*step\s(.)/i

//parse the steps from the instructions and sort them
function recordSteps() {
  let steps = []
  instructions.forEach(instruction => {
    const stepMatches = instruction.match(regex)
    let knownStep = steps.find(result => result.step === stepMatches[2])
    let knownDependentStep = steps.find(result => result.step === stepMatches[1])

    //if an instruction references a step that was previously found and added to the array, add its dependency
    if (knownStep) {
      knownStep.dependentOnStep.add(stepMatches[1])
    } else //create a new entry for the step and add its dependency
      steps.push({
        step: stepMatches[2],
        dependentOnStep: new Set(stepMatches[1]),
        completed: false,
      })
    //if the dependent step has also not been identified, create a new entry for it (with no current dependencies)
    if (!knownDependentStep) {
      steps.push({
        step: stepMatches[1],
        dependentOnStep: new Set(),
        completed: false,
      })
    }
  })

  /*Sort the steps to handle the requirement of breaking the case where two steps are able to be completed 
  by choosing the earlier letter in the alphabet*/
  steps.sort((a, b) => {
    if (a.step < b.step) return -1
    else if (a.step > b.step) return 1
  })
  return steps
}

function part1() {
  let steps = recordSteps()

  //while steps are not complete
  while (steps.find(step => !step.completed)) {
    //find the earliest step that has no dependent steps that aren't complete
    //also need to skip it if it is already complete
    const nextStep = steps.find(step => {
      return step.dependentOnStep.size === 0 && !step.completed
    })
    if (nextStep) {
      nextStep.completed = true
      answer.push(nextStep.step)

      //for every step, remove the now completed step from its dependencies
      steps = steps.map(step => {
        step.dependentOnStep.delete(nextStep.step)
        return step
      })
    } else break
    console.log(steps)
  }
  console.log(`ANSWER: ${answer.join('')}`)
}

function convertStepToSeconds(step) {
  stepCode = step.charCodeAt() //don't need an index because we are expecting 1 character and it defaults to 0
  return 60 + stepCode - 64 //A = 65, so to make the number of seconds work as expected (A = 61 seconds (60 + 1)), subtract 64
}

function isStepAlreadyStarted(workers, step) {
  const result = workers.find(worker => worker.step === step)
  return result ? true : false
}

function part2() {
  let steps = recordSteps()

  //Create an array of 5 workers with an entry for step and the timeRemaining until the step is complete
  const workers = Array.from({ length: 5 }, (worker, i) => ({
    id: i,
    step: undefined,
    timeRemaining: 0,
  }))

  let seconds = 0
  let completedStepsForSecond = [] //keep track of this so we can complete all steps after all workers have been processed for the second

  //while steps are not complete
  while (steps.find(step => !step.completed)) {
    workers.forEach(worker => {
      if (worker.timeRemaining !== 0) worker.timeRemaining-- //tick down the time remaining

      //then if the time remaining is 0, complete the step
      if (worker.timeRemaining === 0) {
        if (worker.step) {
          //mark the step being worked on as complete, and remove it from step dependencies
          steps.find(step => {
            return step.step === worker.step
          }).completed = true
          completedStepsForSecond.push(worker.step)
        }

        //find the earliest step that has no dependent steps that aren't complete
        //also need to skip it if it is already complete
        const nextStep = steps.find(step => {
          return (
            step.dependentOnStep.size === 0 &&
            !step.completed &&
            !isStepAlreadyStarted(workers, step.step)
          )
        })
        if (nextStep) {
          worker.step = nextStep.step
          worker.timeRemaining = convertStepToSeconds(nextStep.step) - 1
        } else worker.step = undefined //if no steps are ready to start, set the workers step to undefined
      }
    })

    //If steps have been completed during this iteration, remove their dependencies from the array
    if (completedStepsForSecond) {
      completedStepsForSecond.forEach(completedStep => {
        steps.map(step => {
          step.dependentOnStep.delete(completedStep)
          return step
        })
      })
    }
    completedStepsForSecond = []
    seconds++
  }

  console.log(`answer? ${seconds}`)
}

part2()
