import xs from 'xstream'

import {
	div,
	h1,
	span,
} from '@cycle/dom'

import {
	draw,
	clear,
} from 'drivers/pixi-driver'


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
	const game$ = xs.of(draw([{
		texture: [ spritesheet, 'ground-01.png' ],
		position: { x: 0, y: 0 },
	}, {
		texture: [ spritesheet, 'ground-03.png' ],
		position: { x: 64, y: 0 },
	}, {
		texture: [ spritesheet, 'ground-04.png' ],
		position: { x: 0, y: 64 },
	}, {
		texture: [ spritesheet, 'ground-06.png' ],
		position: { x: 64, y: 64 },
	}]))

	return {
		DOM: vtree$,
		PIXI: game$,
		router: gameOver$,
	}
}