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
			y: 0,
			width: 3000,
			height: 96,
		},
		x: 0,
		y: 460,
		static: true,
	}
}

const keyToState = value => {
	if (value[keys.space]) return playerStates.attacking
	if (value[keys.up]) return playerStates.jumping
	if (value[keys.right]) return playerStates.moving
	return playerStates.idle
}

const actionHandlers = {
	'ANIMATION': (value, state) => {
		state.current = state.resumeTo
		return state
	},
	'KEYBOARD': (value, state) => {
		if (state.current === playerStates.attacking || state.current === playerStates.jumping) {
			state.resumeTo = value[keys.right] ? playerStates.moving : playerStates.idle
		}
		else {
			state.current = keyToState(value)
		}
		return state
	},
}

const initPlayerState = {
	resumeTo: playerStates.idle,
	current: playerStates.idle,
}

export const playerStateReducer = (state=initPlayerState, { type, value }) => {
	return actionHandlers[type](value, state)
}

export const playerStateMapper = state => state.current

export const gameStateReducer = (state=[initState], [ playerState, dt]) => {
	const [{ player }] = state
	player.previousState = player.state
	player.state = playerState
	state[1] = dt
	return state
}

export const updateSpeed = state => {
	const [{ player }] = state
	switch (player.state) {
		case playerStates.moving:
			player.speed.x = 3.2
			break
		case playerStates.jumping:
			break
		default:
		player.speed.x = 0
	}
	player.speed.y -= (player.state === playerStates.jumping && player.previousState !== player.state) ? 10 : 0
	player.speed.y += 0.5
	if (player.speed.y > 6) {
		player.speed.y = 6
	}
	return state
}

export const updatePosition = state => {
	const [{ player, floor }, dt] = state
	player.x += player.speed.x * dt
	player.y += player.speed.y * dt
	floor.x = player.x - 50
	return state
}
