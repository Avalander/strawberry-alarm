import { keys, playerStates } from 'config'


const initState = {
	player: {
		state: playerStates.idle,
		previousState: playerStates.idle,
		x: 50,
		y: 360,
		speed: { x: 0, y: 0 },
		hitBox: {
			x: 30,
			y: 22,
			width: 42,
			height: 78,
		},
	},
	floor: {
		hitBox: {
			x: 0,
			y: 460,
			width: 3000,
			height: 96,
		},
		static: true,
	}
}

const actionHandlers = {
	'ANIMATION': (value, player) => playerStates.idle,
	'KEYBOARD': (value, player) => {
		if (player.state === playerStates.attacking) return playerStates.attacking
		if (value[keys.space]) return playerStates.attacking
		if (value[keys.right]) return playerStates.moving
		return playerStates.idle
	},
}

export const stateReducer = (state=initState, { type, value }) => {
	const { player } = state
	player.previousState = player.state
	player.state = actionHandlers[type](value, player)
	return state
}

export const updateSpeed = state => {
	const [{ player }] = state
	player.speed.x = (player.state === playerStates.moving) ? 20 : 0
	player.speed.y = 1
	return state
}

export const updatePosition = state => {
	const [{ player }] = state
	player.x += player.speed.x
	player.y += player.speed.y
	return state
}
