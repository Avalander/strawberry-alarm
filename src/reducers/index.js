import {
	sprite,
	animatedSprite,
	tilingSprite,
} from 'drivers/pixi-driver'

import config, { keys, spritesheet } from 'config'

import R from 'ramda'


const initBackground = tilingSprite({
	texture: [ spritesheet, 'bg-exterior.png' ],
	props: { width: config.screen.width, height: config.screen.height,
		tilePosition: { x: 0, y: 0 },
		zOrder: 0,
	},
})

export const backgroundReducer = ({ background=initBackground }, [ keyboard, dt ]) => {
	if (keyboard[keys.right]) {
		background.props.tilePosition.x -= 1
	}
	return { background }
}

const initFloor01 = tilingSprite({
	texture: [ spritesheet, 'ground-02.png' ],
	props: { width: config.screen.width, height: 64, 
		position: { x: 0, y: config.screen.height/2 + 100 },
		tilePosition: { x: 0, y: 0 },
		zOrder: 1,
	},
})

const initFloor02 = tilingSprite({
	texture: [ spritesheet, 'ground-05.png' ],
	props: { width: config.screen.width, height: 64,
		position: { x: 0, y: config.screen.height/2 + 100 + 64 },
		tilePosition: { x: 0, y: 0 },
		zOrder: 1,
	},
})

const initFloor03 = tilingSprite({
	texture: [ spritesheet, 'ground-08.png' ],
	props: { width: config.screen.width, height: 64,
		position: { x: 0, y: config.screen.height/2 + 100 + 128 },
		tilePosition: { x: 0, y: 0 },
		zOrder: 1,
	},
})

export const floorReducer = ({ floor_01=initFloor01, floor_02=initFloor02, floor_03=initFloor03 }, [ keyboard, dt ]) => {
	if (keyboard[keys.right]) {
		floor_01.props.tilePosition.x -= 20
		floor_02.props.tilePosition.x -= 20
		floor_03.props.tilePosition.x -= 20
	}
	return { floor_01, floor_02, floor_03 }
}

const initElisaIdle = sprite({
	texture: [ spritesheet, 'elisa-idle.png' ],
	props: { position: { x: 50, y: config.screen.height/2 }, zOrder: 2},
})

const initElisaRunning = animatedSprite({
	frames: R.range(1, 9).map(i => ([ spritesheet, `elisa-run-0${i}.png`])),
	props: {
		position: { x: 50, y: config.screen.height/2 },
		animationSpeed: 0.2,
		hide: true,
		zOrder: 2,
	},
})

export const elisaReducer = ({ elisa_running=initElisaRunning, elisa_idle=initElisaIdle }, [ keyboard, dt ]) => {
	elisa_running.props.hide = !keyboard[keys.right]
	elisa_idle.props.hide = keyboard[keys.right]
	return { elisa_idle, elisa_running }
}

const reducers = [
	backgroundReducer,
	floorReducer,
	elisaReducer,
]

const gameStateReducer = (state, input) => {
	reducers.forEach(fn => Object.assign(state, fn(state, input)))
	return state
}

export default gameStateReducer
		