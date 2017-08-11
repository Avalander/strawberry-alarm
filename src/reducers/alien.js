import {
	sprite,
	animatedSprite,
} from 'drivers/pixi-driver'

import { spritesheet, alienStates } from 'config'

import R from 'ramda'


const frames = R.range(1, 5).map(i => ([ spritesheet, `alien-walking-0${i}.png` ]))
const dyingFrames = R.range(1, 5).map(i => ([ spritesheet, `alien-die-0${i}.png` ]))

const initAlien = () => animatedSprite({
	frames,
	props: {
		position: { x: 0, y: 0 },
		animationSpeed: 0.1,
	},
	start: true,
})

const initAlienDying = ()  => animatedSprite({
	frames: dyingFrames,
	props: {
		position: { x: 0, y: 0 },
		animationSpeed: 0.1,
		loop: false,
	}
})

export const alienReducer = ({ aliens }, [ state ]) => {
	aliens = aliens || state.aliens.map(x => initAlien())
	for (let i=0; i<state.aliens.length; i++) {
		aliens[i].props.position.x = state.aliens[i].x - (state.player.x - 50)
		aliens[i].props.position.y = state.aliens[i].y
		aliens[i].props.visible = state.aliens[i].visible && state.aliens[i].state !== alienStates.dying
	}
	return { aliens }
}

export const alienDyingReducer = ({ aliens_dying }, [ state ]) => {
	aliens_dying = aliens_dying || state.aliens.map(x => initAlienDying())
	const dyingAliens = state.aliens.filter(x => x.state === alienStates.dying)
	for (let i=0; i<dyingAliens.length; i++) {
		aliens_dying[i].props.position.x = dyingAliens[i].x - (state.player.x - 50)
		aliens_dying[i].props.position.y = dyingAliens[i].y
		aliens_dying[i].props.visible = dyingAliens[i].visible
		if (dyingAliens[i].stateChanged) {
			aliens_dying[i].play = 'alien-die'
		}
	}
	for (let i=dyingAliens.length; i<aliens_dying.length; i++) {
		aliens_dying[i].props.visible = false
	}
	return { aliens_dying }
}
