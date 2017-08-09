export default {
	screen: {
		width: 1137,
		height: 640,
	}
}

export const keys = {
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	space: 32,
}

export const spritesheet = 'src/assets/sprites.json'

export const playerStates = {
	attacking: 'attacking',
	falling: 'falling',
	idle: 'idle',
	jumping: 'jumping',
	moving: 'moving',
}
