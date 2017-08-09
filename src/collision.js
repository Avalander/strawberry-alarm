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

const correctPosition = (gameObject, side) => {
	if (side === 'top' || side === 'bottom') {
		gameObject.y -= gameObject.speed.y
	}
	if (side === 'left' || side === 'right') {
		gameObject.x -= gameObject.speed.x
	}
	return gameObject
}

export const updateCollisions = update => {
	const [ state ] = update
	const { player } = state
	const gameObjects = Object.values(state)
		.filter(x => x !== player)
		.filter(x => x.hitBox)
	gameObjects.forEach(x => {
		const c = collision(player, x)
		correctPosition(player, c)
	})
	return update
}


/*
float w = 0.5 * (A.width() + B.width());
float h = 0.5 * (A.height() + B.height());
float dx = A.centerX() - B.centerX();
float dy = A.centerY() - B.centerY();

if (abs(dx) <= w && abs(dy) <= h)
{
    / collision! /
    float wy = w * dy;
    float hx = h * dx;

    if (wy > hx)
        if (wy > -hx)
            /* collision at the top /
        else
            /* on the left /
    else
        if (wy > -hx)
            /* on the right /
        else
            /* at the bottom /
}
*/