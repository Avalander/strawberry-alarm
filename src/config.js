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
}

export const alien = {
	speed: {
		moving: -0.5,
		dying: 2,
	},
}

export const alienStates = {
	moving: 'moving',
	dying: 'dying',
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
