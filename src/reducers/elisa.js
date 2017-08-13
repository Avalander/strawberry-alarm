import {
	sprite,
	animatedSprite,
} from 'drivers/pixi-driver'

import config, { spritesheet, playerStates } from 'config'

import R from 'ramda'


const y = config.screen.height/2 + 40

const initElisaIdle = () => sprite({
	texture: [ spritesheet, 'elisa-idle.png' ],
	props: {
		position: { x: 50, y },
		scale: { x: 1, y: 1 },
	},
})

const initElisaRunning = () => animatedSprite({
	frames: R.range(1, 9).map(i => ([ spritesheet, `elisa-run-0${i}.png`])),
	props: {
		position: { x: 50, y },
		scale: { x: 1, y: 1 },
		animationSpeed: 0.2,
		visible: false,
	},
	start: true,
})

const initElisaAttacking = () => animatedSprite({
	frames: R.range(1, 7).map(i => ([ spritesheet, `elisa-attack-0${i}.png`])),
	props: {
		position: { x: 50, y },
		scale: { x: 1, y: 1 },
		animationSpeed: 0.2,
		visible: false,
	}
})

const initElisaJumping = () => animatedSprite({
	frames: R.range(1, 5).map(i => ([ spritesheet, `elisa-jump-0${i}.png`])),
	props: {
		position: { x: 50, y },
		scale: { x: 1, y: 1 },
		animationSpeed: 0.1,
		visible: false,
	}
})

const initElisaWounded = () => animatedSprite({
	frames: R.range(1, 3).map(i => ([ spritesheet, `elisa-wounded-0${i}.png` ])),
	props: {
		position: { x: 50, y },
		scale: { x: 1, y: 1},
		animationSpeed: 0.1,
		visible: false,
	}
})

const initElisaCrouching = () => animatedSprite({
	frames: R.range(1, 6).map(i => ([ spritesheet, `elisa-crouching-0${i}.png`])),
	props: {
		position: { x: 50, y },
		scale: { x: 1, y: 1 },
		animationSpeed: 0.4,
		visible: false,
		stopAt: 4,
	}
})

const updatePosition = (sprite, player, camera) => {
	sprite.props.position.x = player.x - camera.x
	sprite.props.position.y = player.y
	sprite.props.scale.x = player.direction
	if (player.direction === -1) {
		sprite.props.position.x += 108
	}
	return sprite
}

export const elisaReducer = ({ elisa_running=initElisaRunning(), elisa_idle=initElisaIdle(), elisa_attacking=initElisaAttacking(), elisa_jumping=initElisaJumping(), elisa_wounded=initElisaWounded(), elisa_crouching=initElisaCrouching() }, [{ player, camera }]) => {
	elisa_attacking.play = player.state === playerStates.attacking && player.previousState !== player.state ? 'elisa-attack' : undefined
	elisa_jumping.play = player.state === playerStates.jumping && player.previousState !== player.state ? 'elisa-jump' : undefined
	elisa_wounded.play = player.state === playerStates.wounded && player.previousState !== player.state ? 'elisa-wounded' : undefined
	elisa_crouching.play = player.state === playerStates.crouching && player.previousState !== player.state ? 'elisa-crouch' : undefined

	elisa_attacking.props.visible = player.state === playerStates.attacking
	elisa_jumping.props.visible = player.state === playerStates.jumping
	elisa_running.props.visible = player.state === playerStates.moving
	elisa_idle.props.visible = player.state === playerStates.idle
	elisa_wounded.props.visible = player.state === playerStates.wounded
	elisa_crouching.props.visible = player.state === playerStates.crouching

	updatePosition(elisa_attacking, player, camera)
	updatePosition(elisa_jumping, player, camera)
	updatePosition(elisa_running, player, camera)
	updatePosition(elisa_idle, player, camera)
	updatePosition(elisa_wounded, player, camera)
	updatePosition(elisa_crouching, player, camera)

	return { elisa_idle, elisa_running, elisa_attacking, elisa_jumping, elisa_wounded, elisa_crouching }
}