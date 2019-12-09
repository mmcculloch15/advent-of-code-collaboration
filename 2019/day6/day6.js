const fs = require('fs')

const orbitData = fs
	.readFileSync('input.txt')
	.toString()
	.split('\n')

const objects = {}

const addIndirectOrbits = (objId, orbiterId) => {
	const obj = objects[objId]
	const orbiter = objects[orbiterId]
	if (obj.directOrbit !== '') {
		orbiter.indirectOrbits.push(obj.directOrbit)
		return addIndirectOrbits(obj.directOrbit, orbiterId)
	} else return
}

orbitData.map(orbit => {
	const [firstObj, orbiter] = orbit.split(')')

	if (!objects[orbiter]) {
		objects[orbiter] = {
			directOrbit: firstObj,
			indirectOrbits: [],
		}
	} else if (objects[orbiter].directOrbit === '') objects[orbiter].directOrbit = firstObj

	//First object doesn't orbit anything yet, but we should create it so we don't run into any undefined errors down the line
	if (!objects[firstObj]) {
		objects[firstObj] = {
			directOrbit: '',
			indirectOrbits: [],
		}
	}
})

for (obj of Object.keys(objects)) {
	if (objects[obj].directOrbit) addIndirectOrbits(objects[obj].directOrbit, obj)
}

let validOrbits = 0

for (obj of Object.keys(objects)) {
	if (objects[obj].directOrbit) validOrbits++
	validOrbits += objects[obj].indirectOrbits.length
}

const YOU = objects['YOU']
const SAN = objects['SAN']
const results = []

YOU.indirectOrbits.map(obj => {
	if (SAN.indirectOrbits.includes(obj)) {
		results.push(
			YOU.indirectOrbits.findIndex(elem => elem === obj) + SAN.indirectOrbits.findIndex(elem => elem === obj)
		)
	}
})

console.log(`Answer ${results.sort().shift()}`)
