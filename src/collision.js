import { playerStates, alienStates } from 'config'


const center = (x, l) => x + l/2
const centerX = (box) => center(box.x + box.hitBox.x, box.hitBox.width)
const centerY = (box) => center(box.y + box.hitBox.y, box.hitBox.height)

const collision = (a, b) => {
	const w = 0.5 * (a.hitBox.width + b.hitBox.width)
	const h = 0.5 * (a.hitBox.height + b.hitBox.height)
	const dx = centerX(a) - centerX(b)
	const dy = centerY(a) - centerY(b)

	if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
		const wy = w * dy
		const hx = h * dx

		if (wy > hx) {
			return (wy > -hx) ? 'top' : 'left'
		}
		return (wy > -hx) ? 'right' : 'bottom'
	}
	return undefined
}

const sidedCollision = (gameObject, collision) => {
	if (collision && gameObject.hasOwnProperty('collisions')) {
		return gameObject.collisions[collision] ? collision : undefined
	}
	return collision
}

const correctPosition = (gameObject, side, dt) => {
	if ((side === 'top' && gameObject.speed.y > 0) || (side === 'bottom' && gameObject.speed.y < 0)) {
		gameObject.y -= gameObject.speed.y * dt
		gameObject.speed.y = 0
	}
	if (side === 'left' || side === 'right') {
		gameObject.x -= gameObject.speed.x * dt * (gameObject.direction || 1)
		gameObject.speed.x = 0
	}
	return gameObject
}

const attacks = (alien, playerAttack) => {
	if (collision(alien, playerAttack)) {
		alien.speed.x = 2
		alien.state = alienStates.dying
		alien.stateChanged = true
	}
}

const updateAlienCollisions = (aliens, player, playerAttack, gameObjects, dt) => {
	const aliensAlive = aliens
		.filter(x => x.state !== alienStates.dying)
		.filter(x => x.visible)
	aliensAlive.forEach(a => gameObjects.forEach(x => {
		const c = sidedCollision(x, collision(x, a))
		correctPosition(a, c, dt)
	}))
	if (player.state !== playerStates.attacking && player.previousState === playerStates.attacking ) {
		aliensAlive.forEach(x => attacks(x, playerAttack))
	}
}

export const updateCollisions = update => {
	const [ state, dt ] = update
	const { player, playerAttack, aliens } = state
	//const gameObjects = [...state.terrain, state.floor, state.leftBorder]
	const playerCollisionObjects = [...state.terrain, state.floor, state.leftBorder, state.rightBorder]
	const alienCollisionObjects = [...state.terrain, state.floor]
	
	playerCollisionObjects.forEach(x => {
		if (player.speed.y < 0) return
		const c = sidedCollision(x, collision(x, player))
		correctPosition(player, c, dt)
		if (c && player.state === playerStates.jumping) {
			player.state = player.resumeToState
		}
	})

	updateAlienCollisions(aliens, player, playerAttack, alienCollisionObjects, dt)
	
	return update
}

export const collisionWithFlag = update => {
	const [{ player, flag }] = update
	return collision(player, flag)
}
