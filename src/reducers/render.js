import { draw } from 'drivers/pixi-driver'


const sortSprites = (a, b) => a.props.position.y - b.props.position.y

const spritesToDraw = x => {
	const sprites = [
		...x.aliens_dying,
		...x.aliens,
		...x.aliens_attacking,
		x.elisa_idle,
		x.elisa_running,
		x.elisa_jumping,
		x.elisa_attacking,
	]
	sprites.sort(sortSprites)

	const result = [
		x.background,
		x.moon,
		x.floor_01,
		x.floor_02,
		x.floor_03,
		...x.terrain_tiles,
		x.flag_tile,
	].concat(sprites)

	return draw(result)
}

export default spritesToDraw
