import {
	sprite,
	animatedSprite,
} from 'drivers/pixi-driver'

import config, { spritesheet, playerStates } from 'config'

import R from 'ramda'


const y = config.screen.height/2 + 40

const initElisaIdle = () => sprite({
	texture: [ spritesheet, 'elisa-idle.png' ],
	props: { position: { x: 50, y }},
})

const initElisaRunning = () => animatedSprite({
	frames: R.range(1, 9).map(i => ([ spritesheet, `elisa-run-0${i}.png`])),
	props: {
		position: { x: 50, y },
		animationSpeed: 0.2,
		visible: false,
	},
	start: true,
})

const initElisaAttacking = () => animatedSprite({
	frames: R.range(1, 7).map(i => ([ spritesheet, `elisa-attack-0${i}.png`])),
	props: {
		position: { x: 50, y },
		animationSpeed: 0.2,
		visible: false,
	}
})

const initElisaJumping = () => animatedSprite({
	frames: R.range(1, 5).map(i => ([ spritesheet, `elisa-jump-0${i}.png`])),
	props: {
		position: { x: 50, y },
		animationSpeed: 0.1,
		visible: false,
	}
})

const updatePosition = (sprite, player, camera) => {
	sprite.props.position.x = player.x - camera.x
	sprite.props.position.y = player.y
	return sprite
}

export const elisaReducer = ({ elisa_running=initElisaRunning(), elisa_idle=initElisaIdle(), elisa_attacking=initElisaAttacking(), elisa_jumping=initElisaJumping() }, [{ player, camera }]) => {
	elisa_attacking.play = player.state === playerStates.attacking && player.previousState !== player.state ? 'elisa-attack' : undefined
	elisa_jumping.play = player.state === playerStates.jumping && player.previousState !== player.state ? 'elisa-jump' : undefined
	elisa_attacking.props.visible = player.state === playerStates.attacking
	elisa_jumping.props.visible = player.state === playerStates.jumping
	elisa_running.props.visible = player.state === playerStates.moving
	elisa_idle.props.visible = player.state === playerStates.idle
	updatePosition(elisa_attacking, player, camera)
	updatePosition(elisa_jumping, player, camera)
	updatePosition(elisa_running, player, camera)
	updatePosition(elisa_idle, player, camera)
	return { elisa_idle, elisa_running, elisa_attacking, elisa_jumping }
}