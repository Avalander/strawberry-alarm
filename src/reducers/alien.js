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

const initAlienAttacking = () => animatedSprite({
	frames: R.range(1, 6).map(i => ([ spritesheet, `alien-fire-0${i}.png` ])),
	props: {
		position: { x: 0, y: 0 },
		animationSpeed: 0.1,
	}
})

export const alienReducer = ({ aliens }, [ state ]) => {
	aliens = aliens || state.aliens.map(x => initAlien())
	for (let i=0; i<state.aliens.length; i++) {
		aliens[i].props.position.x = state.aliens[i].x - state.camera.x
		aliens[i].props.position.y = state.aliens[i].y
		aliens[i].props.visible = state.aliens[i].visible && state.aliens[i].state === alienStates.moving
	}
	return { aliens }
}

export const alienDyingReducer = ({ aliens_dying }, [ state ]) => {
	aliens_dying = aliens_dying || state.aliens.map(x => initAlienDying())
	const dyingAliens = state.aliens.filter(x => x.state === alienStates.dying)
	for (let i=0; i<dyingAliens.length; i++) {
		aliens_dying[i].props.position.x = dyingAliens[i].x - state.camera.x
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

export const alienAttackingReducer = ({ aliens_attacking }, [{ aliens, camera }]) => {
	aliens_attacking = aliens_attacking || aliens.map(x => initAlienAttacking())
	for (let i=0; i<aliens.length; i++) {
		aliens_attacking[i].props.position.x = aliens[i].x - camera.x
		aliens_attacking[i].props.position.y = aliens[i].y
		aliens_attacking[i].props.visible = aliens[i].visible && aliens[i].state === alienStates.attacking
		if (aliens[i].stateChanged && aliens[i].state === alienStates.attacking) {
			aliens_attacking[i].play = [ 'alien-attack', aliens[i].id ]
		}
	}
	return { aliens_attacking }
}
