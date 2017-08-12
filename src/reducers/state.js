import prefabs from 'prefabs'
import {
	alien as alienConfig,
	alienStates,
	directions,
	keys,
	playerStates,
	screen,
} from 'config'

import level from 'levels/level-01.json'


const initState = () => ([{
	player: {
		state: playerStates.idle,
		previousState: playerStates.idle,
		resumeToState: playerStates.idle,
		direction: directions.right,
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
	leftBorder: {
		hitBox: { x: 0, y: 0, width: 100, height: screen.height },
		x: -100,
		y: 0,
		static: true,
	},
	rightBorder: {
		hitBox: { x: 0, y: 0, width: 100, height: screen.height },
		x: screen.width,
		y: 0,
		static: true,
	},
	camera: {
		x: 0,
		y: 0,
		width: screen.width,
		height: screen.height,
	},
	aliens: level.aliens.map(x => Object.assign(prefabs.alien(), x)),
	terrain: level.terrain.map(x => Object.assign(prefabs[x.prefab](), x)),
	flag: Object.assign(prefabs.flag(), level.flag)
}])

const commands = {
	attack: player => {
		if (player.state !== playerStates.jumping) {
			player.state = playerStates.attacking
		}
	},
	changeDirection: direction => player => {
		player.direction = direction
	},
	move: player => {
		if (player.state === playerStates.idle) {
			player.state = playerStates.moving
		}
		player.resumeToState = playerStates.moving
	},
	jump: player => {
		if (player.state !== playerStates.attacking) {
			player.state = playerStates.jumping
		}
	},
	stop: direction => player => {
		if (direction === player.direction) {
			if (player.state === playerStates.moving) {
				player.state = playerStates.idle
			}
			player.resumeToState = playerStates.idle
		}
	},
	resume: player => {
		player.state = player.resumeToState
	},
	none: () => {},
}

const actionHandlers = {
	'ANIMATION': value => value === 'elisa-attack' ? [commands.resume] : [commands.none],
	'keydown': value => {
		switch (value) {
			case keys.space:
				return [commands.attack]
			case keys.up:
				return [commands.jump]
			case keys.right:
				return [commands.changeDirection(directions.right), commands.move]
			case keys.left:
				return [commands.changeDirection(directions.left), commands.move]
			default:
				return [commands.none]
		}
	},
	'keyup': value => {
		switch (value) {
			case keys.right:
				return [commands.stop(directions.right)]
			case keys.left:
				return [commands.stop(directions.left)]
			default:
				return [commands.none]
		}
	}	
}

export const playerStateMapper = ({ type, value }) => {
	return actionHandlers[type](value)
}

export const gameStateReducer = (state=initState(), [ command, dt]) => {
	const [{ player }] = state
	player.previousState = player.state
	command.forEach(c => c(player))
	state[1] = dt
	return state
}

export const updateCamera = state => {
	const [{ camera, player, flag, leftBorder, rightBorder }] = state
	if (player.x > camera.x + 100) {
		camera.x = player.x - 100
	}
	if (camera.x > flag.x - 50) {
		camera.x = flag.x - 50
	}
	leftBorder.x = camera.x - leftBorder.hitBox.width
	rightBorder.x = camera.x + camera.width
	return state
}

export const updateSpeed = state => {
	const [{ player }] = state
	switch (player.state) {
		case playerStates.moving:
			player.speed.x = 3.2
			break
		case playerStates.jumping:
			if (player.resumeToState === playerStates.moving) {
				player.speed.x = 3.2
			}
			break
		default:
			player.speed.x = 0
	}
	player.speed.y -= (player.state === playerStates.jumping && player.previousState !== player.state) ? 10 : 0
	player.speed.y += 0.5
	if (player.speed.y > 8) {
		player.speed.y = 6
	}
	return state
}

export const updatePosition = state => {
	const [{ player, playerAttack, floor, camera }, dt] = state
	player.x += player.speed.x * dt * player.direction
	player.y += player.speed.y * dt
	playerAttack.x = player.x
	playerAttack.y = player.y
	if (player.direction === directions.left) {
		playerAttack.x -= 108
	}
	floor.x = camera.x - 100
	return state
}

export const updateVisible = keyPath => state => {
	const [{ player, camera }] = state
	state[0][keyPath].forEach(x => {
		x.visible = x.x < camera.x + camera.width && x.x > camera.x - 108 && x.y < camera.height
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
