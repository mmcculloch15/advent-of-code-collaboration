const fs = require('fs')

const records = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')
  .sort()

const guards = []

function getMinuteFromRecord(record) {
  const timestamp = record.slice(1).split(']')[0]
  return parseInt(timestamp.slice(timestamp.length - 2))
}

function part1(records) {
  let currentGuard, currentGuardIndex, theMinuteTheyFellAsleep, theMinuteTheyWokeUp
  for (record of records) {
    if (record.includes('Guard')) {
      currentGuard = record.split('#')[1].split(' ')[0]
      console.log(`Current guard ${currentGuard}`)

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


      // for (let i = theMinuteTheyFellAsleep; i < (theMinuteTheyFellAsleep + minutesAsleep); i++) {
      //   if (!guards.find(guard => guard.id === currentGuard).minutesAsleep[i]) guards[currentGuard].minutesAsleep[i] = 1
      //   else guards[currentGuard].minutesAsleep[i]++
      // }
      // //increment the guards time asleep by minutesAsleep? guards[currentGuard].totalTimeAsleep++
      // guards[currentGuard].totalMinutesAsleep += minutesAsleep
    }
  }

  //At this point, the guard Object will contain each guard, their individual minutes asleep, and their totalTimeAsleep

  //Compare totalTimeAsleep to find the guard that slept the most

  //Object.entries(guards).map(guard => { console.log(guard) })
  const sortedGuards = guards.sort((guard1, guard2) => {
    if (guard1.totalMinutesAsleep < guard2.totalMinutesAsleep) return 1
    else if (guard1.totalMinutesAsleep === guard2.totalMinutesAsleep) return 0
    else return -1
  })

  const correctGuard = sortedGuards[0].id
  //const bestMinute = Math.max(...Object.values(sortedGuards[0].minutesAsleep))



  const bestMinute = Object.entries(sortedGuards[0].minutesAsleep).reduce((bestMinute, currentMinute) => {
    if (currentMinute[1] > bestMinute.value) return { minute: currentMinute[0], value: currentMinute[1] }
    else return bestMinute
    //if (currentMinute > bestMinute.value) return { index: currentIndex, value: currentMinute }
  }, {
      minute: 0,
      value: 0
    })


  console.log(`best minute: ${bestMinute.minute}, target guard: ${sortedGuards[0].id}`)
  console.log(`answer: ${(bestMinute.minute) * sortedGuards[0].id}`)

  //For that guard, find the minute that has the highest occurrences of being asleep

  //   let numOfMaxAsleepTime = guards[0]
  // console.log(Array.from(guards => guards))      
  //console.log(guards)

  // Object.keys(guards).forEach(guard => {
  //   guardSleepTime[guard] = Object.values(guards[guard].minutesAsleep).reduce((totalMinutesAsleep, val) => totalMinutesAsleep += val, 0)
  // })

  // const sortedGuardTime = Object.values(guardSleepTime).sort()
  //console.log(sortedGuardTime[sortedGuardTime.length - 1])
  //then look at their individual minutesAsleep object to find the minute they were asleep the most
}

part1(records)

