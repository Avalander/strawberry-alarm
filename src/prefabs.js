import { alienStates, alien as alienConfig } from 'config'


let nextAlienId = 1

export const alien = () => ({
	hitBox: {
		x: 30,
		y: 5,
		width: 50,
		height: 103,
	},
	speed: {
		x: -0.5,
		y: 0,
	},
	state: alienStates.moving,
	stateChanged: false,
	timeSinceLastShot: Math.floor(Math.random() * 100),
	id: nextAlienId++,
})

export const bullet = () => ({
	hitBox: {
		x: 2,
		y: 5,
		width: 52,
		height: 11,
	},
	speed: {
		x: -alienConfig.bullet.speed,
		y: 0,
	},
	active: false,
	x: 0,
	y: 0,
})

export const tile = () => ({
	hitBox: {
		x: 0,
		y: 0,
		width: 32,
		height: 16,
	},
	static: true,
	collisions: {
		top: true,
	},
})

export const flag = () => ({
	visible: true,
	hitBox: {
		x: 6,
		y: 8,
		width: 48,
		height: 73,
	},
})

export default {
	alien,
	bullet,
	flag,
	tile,
}