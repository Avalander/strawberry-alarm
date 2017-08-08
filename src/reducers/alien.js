import {
	sprite,
	animatedSprite,
} from 'drivers/pixi-driver'

import config, { spritesheet } from 'config'

import R from 'ramda'


const zOrder = 2

const initAlien = animatedSprite({
	frames: R.range(1, 5).map(i => ([ spritesheet, `alien-walking-0${i}.png` ])),
	props: {
		position: { x: 400, y: config.screen.height/2 },
		animationSpeed: 0.1,
		zOrder
	}
})

export const alienReducer = ({ alien=initAlien }, [ action, dt ]) => {
	return { alien }
}
