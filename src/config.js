export const screen = {
	width: 1137,
	height: 640,
}

export const keys = {
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	space: 32,
	a: 65,
	d: 68,
	w: 87,
	s: 83,
}

export const directions = {
	left: -1,
	right: 1,
}

export const spritesheet = 'src/assets/sprites.json'

export const playerStates = {
	attacking: 'attacking',
	falling: 'falling',
	idle: 'idle',
	jumping: 'jumping',
	moving: 'moving',
	wounded: 'wounded',
}

export const alien = {
	speed: {
		moving: -0.5,
		dying: 2,
	},
	shootFreq: 500,
	shootDistance: 600,
	shootAngle: 50,
	bullet: {
		speed: 10,
	}
}

export const alienStates = {
	attacking: 'attacking',
	dying: 'dying',
	moving: 'moving',
}

export const terrain = {
	tile: {
		size: 32,
	},
}

export default {
	alien,
	directions,
	keys,
	playerStates,
	screen,
	spritesheet,
	terrain,
}
