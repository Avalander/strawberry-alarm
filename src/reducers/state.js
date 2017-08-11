import prefabs from 'prefabs'
import { screen, keys, playerStates, alienStates, alien as alienConfig } from 'config'

import level from 'levels/level-01.json'


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
	playerAttack: {
		hitBox: {
			x: 70,
			y: 31,
			width: 70,
			height: 40,
		},
	},
	floor: {
		hitBox: { x: 0, y: 0, width: 3000, height: 96, },
		x: 0,
		y: 460,
		static: true,
	},
	aliens: [
		Object.assign({ x: 900, y: 356 }, prefabs.alien()),
		Object.assign({ x: 1200, y: 356 }, prefabs.alien()),
		Object.assign({ x: 1500, y: 356 }, prefabs.alien()),
		Object.assign({ x: 1800, y: 356 }, prefabs.alien()),
	],
	terrain: level.terrain.map(x => Object.assign(x, prefabs[x.prefab]())),
}

const keyToState = value => {
	if (value[keys.space]) return playerStates.attacking
	if (value[keys.up]) return playerStates.jumping
	if (value[keys.right]) return playerStates.moving
	return playerStates.idle
}

const actionHandlers = {
	'ANIMATION': (value, state) => {
		if (value.startsWith('elisa')) {
			state.current = state.resumeTo
		}
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
	const [{ player, playerAttack, floor }, dt] = state
	player.x += player.speed.x * dt
	player.y += player.speed.y * dt
	playerAttack.x = player.x
	playerAttack.y = player.y
	floor.x = player.x - 100
	return state
}

/*
export const updateVisible = state => {
	const [{ aliens, player }] = state
	aliens.forEach(x => {
		x.visible = x.x < player.x + screen.width && x.x > player.x - 158 && x.y < screen.height
	})
	return state
}
*/

export const updateVisible = keyPath => state => {
	const [{ player }] = state
	state[0][keyPath].forEach(x => {
		x.visible = x.x < player.x + screen.width && x.x > player.x - 158 && x.y < screen.height
	})
	return state
}

export const updateAliens = state => {
	const [{ aliens }] = state
	aliens
		.filter(x => x.visible)
		.map(x => {
			x.stateChanged = false
			return x
		})
		.map(x => {
			switch (x.state) {
				case alienStates.moving:
					x.speed.x = alienConfig.speed.moving
					break
				case alienStates.dying:
					x.speed.x = alienConfig.speed.dying
					break
				default:
					x.speed.x = 0
			}
			x.speed.y += 0.5
			if (x.speed.y > 6) {
				x.speed.y = 6
			} 
			return x
		})
		.map(x => {
			x.x += x.speed.x
			x.y += x.speed.y
			return x
		})
	return state
}
