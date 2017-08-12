import { animatedSprite } from 'drivers/pixi-driver'
import { spritesheet } from 'config'

import R from 'ramda'


const initFlag = () => animatedSprite({
	frames: R.range(1, 5).map(i => ([ spritesheet, `flag-0${i}.png`])),
	props: {
		position: { x: 0, y: 0 },
		animationSpeed: 0.2,
	},
	start: true,
})

export const flagReducer = ({ flag_tile=initFlag() }, [{ camera, flag }]) => {
	flag_tile.props.position.x = flag.x - camera.x
	flag_tile.props.position.y = flag.y
	flag_tile.props.visible = flag.visible
	return { flag_tile }
}
