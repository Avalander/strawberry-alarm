import {
	sprite,
	tilingSprite,
} from 'drivers/pixi-driver'

import config, { spritesheet } from 'config'


const initBackground = () => tilingSprite({
	texture: [ spritesheet, 'bg-exterior.png' ],
	props: { width: config.screen.width, height: config.screen.height,
		tilePosition: { x: 0, y: 0 },
	},
})

export const backgroundReducer = ({ background=initBackground() }, [{ camera }]) => {
	background.props.tilePosition.x = -camera.x * 0.05
	return { background }
}

const initMoon = () => sprite({
	texture: [ spritesheet, 'bg-moon.png' ],
	props: { position: { x: 400, y: 0 }},
})

export const moonReducer = ({ moon=initMoon() }, [{ camera }]) => {
	moon.props.position.x = 400 - camera.x * 0.005
	return { moon }
}

const initFloor01 = () => tilingSprite({
	texture: [ spritesheet, 'ground-02.png' ],
	props: { width: config.screen.width, height: 32, 
		position: { x: 0, y: config.screen.height/2 + 140 },
		tilePosition: { x: 0, y: 0 },
	},
})

const initFloor02 = () => tilingSprite({
	texture: [ spritesheet, 'ground-05.png' ],
	props: { width: config.screen.width, height: 32,
		position: { x: 0, y: config.screen.height/2 + 140 + 32 },
		tilePosition: { x: 0, y: 0 },
	},
})

const initFloor03 = () => tilingSprite({
	texture: [ spritesheet, 'ground-08.png' ],
	props: { width: config.screen.width, height: 32,
		position: { x: 0, y: config.screen.height/2 + 140 + 64 },
		tilePosition: { x: 0, y: 0 },
	},
})

export const floorReducer = ({ floor_01=initFloor01(), floor_02=initFloor02(), floor_03=initFloor03() }, [{ camera }]) => {
	floor_01.props.tilePosition.x = -camera.x 
	floor_02.props.tilePosition.x = -camera.x
	floor_03.props.tilePosition.x = -camera.x
	return { floor_01, floor_02, floor_03 }
}