import xs from 'xstream'

import {
	div,
	h1,
	span,
} from '@cycle/dom'

import {
	draw,
	clear,
	sprite,
	tilingSprite,
} from 'drivers/pixi-driver'

import R from 'ramda'

import config from 'config'


export default function Game({ DOM }) {
	const countDown$ = xs.periodic(1000)
		.fold((acc, x) => acc - 1, 10)
	
	const gameOver$ = countDown$
		.filter(x => x <= 0)
		.mapTo('game-over')

	const vtree$ = countDown$.map(x =>
		div([
			h1('Game!'),
			span(`${x} seconds to finish`),
		])
	)

	const spritesheet = 'src/assets/sprites.json'

	const initState = [
		tilingSprite({
			texture: [ spritesheet, 'bg-exterior.png' ],
			props: { width: config.screen.width, height: config.screen.height },
		}),
		sprite({
			texture: [ spritesheet, 'elisa-idle.png' ],
			props: { position: { x: 50, y: config.screen.height/2 }},
		}),
		sprite({
			texture: [ spritesheet, 'ground-01.png' ],
			props: { position: { x: 0, y: config.screen.height/2 + 100 }},
		}),
		...R.range(1, 11).map(i => sprite({
			texture: [ spritesheet, 'ground-02.png' ],
			props: { position: { x: 64 * i, y: config.screen.height/2 + 100 }},
		})),
		sprite({
			texture: [ spritesheet, 'ground-03.png' ],
			props: { position: { x: 64 * 11, y: config.screen.height/2 + 100 }},
		}),
	]

	const state$ = xs.periodic(100)
		.fold(
			(acc, x) => {
				acc[0].props.tilePosition = acc[0].props.tilePosition || { x: 0, y: 0}
				acc[0].props.tilePosition.x -= 1
				return acc
			},
			initState)
		.map(x => draw(x))
	
	
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