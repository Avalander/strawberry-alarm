import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'

import {
	div,
	span,
} from '@cycle/dom'

import {
	draw,
	clear,
	sprite,
	animatedSprite,
	tilingSprite,
} from 'drivers/pixi-driver'

import R from 'ramda'

import config from 'config'


const keys = {
	left: 37,
	up: 38,
	right: 39,
	down: 40
}
const recognisedKeys = Object.values(keys)

const inputHandler = () => {
	const keyboard$ = xs.merge(
			fromEvent(window, 'keydown'),
			fromEvent(window, 'keyup'),
		)
		.filter(x => recognisedKeys.indexOf(x.keyCode) !== -1)
		.map(x => {
			x.preventDefault()
			return { type: x.type, keyCode: x.keyCode }
		})
		.compose(dropRepeats((a, b) => a.type === b.type && a.keyCode === b.keyCode))
		.fold((acc, { type, keyCode }) => {
			acc[keyCode] = type === 'keydown'
			return acc
		}, {})
	return keyboard$
}

export default function Game({ DOM }) {
	const gameOver$ = xs.never()

	const instructionsText = `Aliens are invading your castle. Go and fight them.
	Use arrow keys to move and space to attack.`
	const vtree$ = xs.periodic(100).take(instructionsText.length + 1)
		.map(i => instructionsText.substring(0, i).split('\n'))
		.map(text => div('.column', text.map(x => span(x))))
		
	const keyboard$ = inputHandler()

	const spritesheet = 'src/assets/sprites.json'

	const initState = {
		background: tilingSprite({
			texture: [ spritesheet, 'bg-exterior.png' ],
			props: { width: config.screen.width, height: config.screen.height,
				tilePosition: { x: 0, y: 0 },
			},
		}),
		elisa_idle: sprite({
			texture: [ spritesheet, 'elisa-idle.png' ],
			props: { position: { x: 50, y: config.screen.height/2 }},
		}),
		elisa_running: animatedSprite({
			frames: R.range(1, 9).map(i => ([ spritesheet, `elisa-run-0${i}.png`])),
			props: {
				position: { x: 50, y: config.screen.height/2 },
				animationSpeed: 0.2,
				hide: true,
			},
		}),
		floor_01: tilingSprite({
			texture: [ spritesheet, 'ground-02.png' ],
			props: { width: config.screen.width, height: 64, 
				position: { x: 0, y: config.screen.height/2 + 100 },
				tilePosition: { x: 0, y: 0 },
			},
		}),
		floor_02: tilingSprite({
			texture: [ spritesheet, 'ground-05.png' ],
			props: { width: config.screen.width, height: 64,
				position: { x: 0, y: config.screen.height/2 + 100 + 64 },
				tilePosition: { x: 0, y: 0 },
			},
		}),
		floor_03: tilingSprite({
			texture: [ spritesheet, 'ground-08.png' ],
			props: { width: config.screen.width, height: 64,
				position: { x: 0, y: config.screen.height/2 + 100 + 128 },
				tilePosition: { x: 0, y: 0 },
			},
		}),
	}

	const state$ = xs.combine(keyboard$, xs.periodic(100))
		.fold(
			(acc, [keyboard, x]) => {
				if (keyboard[keys.right]) {
					acc.background.props.tilePosition.x -= 1
					acc.floor_01.props.tilePosition.x -= 20
					acc.floor_02.props.tilePosition.x -= 20
					acc.floor_03.props.tilePosition.x -= 20
					acc.elisa_running.props.hide = false
					acc.elisa_idle.props.hide = true
				}
				else {
					acc.elisa_running.props.hide = true
					acc.elisa_idle.props.hide = false
				}
				return acc
			},
			initState)
		.map(x => draw(Object.values(x)))
	
	
	xs.of(draw([
		tilingSprite({
			texture: [ spritesheet, 'bg-exterior.png' ],
			props: { width: config.screen.width, height: config.screen.height },
		}),
	]))

	return {
		DOM: vtree$,
		PIXI: state$,
		router: gameOver$,
	}
}