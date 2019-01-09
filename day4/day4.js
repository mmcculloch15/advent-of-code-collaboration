const fs = require('fs')

const records = fs
  .readFileSync('./testinput.txt')
  .toString()
  .split('\n')
  .sort()

const guards = {}

function getMinuteFromRecord(record) {
  const timestamp = record.slice(1).split(']')[0]
  return parseInt(timestamp.slice(timestamp.length - 2))
}

function part1(records) {
  let currentGuard, asleepMinute, awakeMinute
  for (record of records) {
    if (record.includes('Guard')) {
      currentGuard = record.split('#')[1].split(' ')[0]
      console.log(`Current guard ${currentGuard}`)
      if (!guards[currentGuard]) {
        guards[currentGuard] = {
          minutesAsleep: {}, //object that will be from 0-59, with a count of how many times they were asleep at that minute
        }
      }
    }

    if (record.includes('falls asleep')) {
      asleepMinute = getMinuteFromRecord(record)
    }
    if (record.includes('wakes up')) {
      awakeMinute = getMinuteFromRecord(record)
      const minutesAsleep = awakeMinute - asleepMinute

      for (let i = asleepMinute; i < (asleepMinute + minutesAsleep); i++) {
        if (!guards[currentGuard].minutesAsleep[i]) guards[currentGuard].minutesAsleep[i] = 1
        else guards[currentGuard].minutesAsleep[i]++
      }
    }
  }
  const guardSleepTime = {}
  //guards array is complete. Need to sum up each guard's sleep and find the one that slept the most

  console.log(Object.entries(guards))
  Object.keys(guards).forEach(guard => {
    guardSleepTime[guard] = Object.values(guards[guard].minutesAsleep).reduce((totalMinutesAsleep, val) => totalMinutesAsleep += val, 0)
  })

  const sortedGuardTime = Object.values(guardSleepTime).sort()
  //console.log(sortedGuardTime[sortedGuardTime.length - 1])
  //then look at their individual minutesAsleep object to find the minute they were asleep the most
}

part1(records)

