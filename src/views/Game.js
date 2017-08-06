import xs from 'xstream'

import {
	div,
	h1,
	span,
} from '@cycle/dom'


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

	return {
		DOM: vtree$,
		router: gameOver$,
	}
}