import {
	tilingSprite,
} from 'drivers/pixi-driver'

import config, { spritesheet } from 'config'


const initBackground = tilingSprite({
	texture: [ spritesheet, 'bg-exterior.png' ],
	props: { width: config.screen.width, height: config.screen.height,
		tilePosition: { x: 0, y: 0 },
		zOrder: 0,
	},
})

export const backgroundReducer = ({ background=initBackground }, [ action, dt ]) => {
	if (action === 'move') {
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

export const floorReducer = ({ floor_01=initFloor01, floor_02=initFloor02, floor_03=initFloor03 }, [ action, dt ]) => {
	if (action === 'move') {
		floor_01.props.tilePosition.x -= 20
		floor_02.props.tilePosition.x -= 20
		floor_03.props.tilePosition.x -= 20
	}
	return { floor_01, floor_02, floor_03 }
}