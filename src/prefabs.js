import { alienStates } from 'config'


export const alien = () => ({
	hitBox: {
		x: 30,
		y: 5,
		width: 57,
		height: 103,
	},
	speed: {
		x: -0.5,
		y: 0,
	},
	state: alienStates.moving,
	stateChanged: false,
})