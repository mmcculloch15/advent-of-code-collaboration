const fs = require('fs')

const records = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')
  .sort()

const guards = []

function getMinuteFromRecord(record) {
  //Extract the minutes section from the timestamp by matching digits after a colon 
  const regex = /:(\d+)/
  const timestamp = record.match(regex)[1]
  return parseInt(timestamp)
}

function part1(records) {
  let currentGuard, currentGuardIndex, theMinuteTheyFellAsleep, theMinuteTheyWokeUp
  for (record of records) {
    if (record.includes('Guard')) {
      //Using a regex, match any number of digits after a # character and assign it as the currentGuard
      const currentGuard = record.match(/#(\d+)/)[1]

      if (!guards.find(guard => guard.id === currentGuard)) {
        guards.push({
          id: currentGuard,
          minutesAsleep: {},
          totalMinutesAsleep: 0
        })
      }
      currentGuardIndex = guards.findIndex(guard => guard.id === currentGuard)
    }

    if (record.includes('falls asleep')) {
      theMinuteTheyFellAsleep = getMinuteFromRecord(record)
    }
    if (record.includes('wakes up')) {
      theMinuteTheyWokeUp = getMinuteFromRecord(record)
      const minutesAsleep = theMinuteTheyWokeUp - theMinuteTheyFellAsleep

      for (let i = theMinuteTheyFellAsleep; i < (theMinuteTheyFellAsleep + minutesAsleep); i++) {
        //if the guard has not fallen asleep on this minute bofore, add it to the minutesAsleep object and set it to 1
        if (!guards[currentGuardIndex].minutesAsleep[i]) {
          guards[currentGuardIndex].minutesAsleep[i] = 1
        }
        else {
          guards[currentGuardIndex].minutesAsleep[i]++
        }
      }

      guards[currentGuardIndex].totalMinutesAsleep += minutesAsleep
    }
  }

  //At this point, the guard Object will contain each guard, their individual minutes asleep, and their totalTimeAsleep
  //Sort the guards array by the totalMinutesAsleep variable to find the guard that slept the most
  const sortedGuards = guards.sort((guard1, guard2) => {
    //If guard1 slept more than guard2, move guard1 to an index below guard2
    if (guard1.totalMinutesAsleep < guard2.totalMinutesAsleep) return 1
    else if (guard1.totalMinutesAsleep === guard2.totalMinutesAsleep) return 0
    else return -1
  })

  const correctGuard = sortedGuards[0].id
  const bestMinute = Object.entries(sortedGuards[0].minutesAsleep).reduce((bestMinute, currentMinute) => {
    if (currentMinute[1] > bestMinute.value) return { minute: currentMinute[0], value: currentMinute[1] }
    else return bestMinute
  }, {
      minute: 0,
      value: 0
    })


  //console.log(`best minute: ${bestMinute.minute}, target guard: ${sortedGuards[0].id}`)
  console.log(`answer: ${(bestMinute.minute) * sortedGuards[0].id}`)
}

part1(records)

