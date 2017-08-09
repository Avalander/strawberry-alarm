import {
	sprite,
	animatedSprite,
} from 'drivers/pixi-driver'

import config, { spritesheet, playerStates } from 'config'

import R from 'ramda'


const zOrder = 2
const y = config.screen.height/2 + 40

const initElisaIdle = sprite({
	texture: [ spritesheet, 'elisa-idle.png' ],
	props: { position: { x: 50, y }, zOrder },
})

const initElisaRunning = animatedSprite({
	frames: R.range(1, 9).map(i => ([ spritesheet, `elisa-run-0${i}.png`])),
	props: {
		position: { x: 50, y },
		animationSpeed: 0.2,
		visible: false,
		zOrder,
	},
})

const initElisaAttacking = animatedSprite({
	frames: R.range(1, 7).map(i => ([ spritesheet, `elisa-attack-0${i}.png`])),
	props: {
		position: { x: 50, y },
		animationSpeed: 0.2,
		visible: false,
		zOrder,
	}
})

export const elisaReducer = ({ elisa_running=initElisaRunning, elisa_idle=initElisaIdle, elisa_attacking=initElisaAttacking }, [{ player }]) => {
	elisa_attacking.play = player.state === playerStates.attacking && player.previousState !== player.state ? 'elisa-attack' : undefined
	elisa_attacking.props.visible = player.state === playerStates.attacking
	elisa_running.props.visible = player.state === playerStates.moving
	elisa_idle.props.visible = player.state === playerStates.idle
	return { elisa_idle, elisa_running, elisa_attacking }
}