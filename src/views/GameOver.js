import xs from 'xstream'

import {
	button,
	div,
	h1,
	span,
} from '@cycle/dom'


export default function GameOver({ DOM }) {
	const backClick$ = DOM.select('.back').events('click')
		.mapTo('main-menu')
	
	const vtree$ = xs.of(
		div('.content', [
			h1('Game Over!'),
			span('Congratulations on finishing a game with such an epic length!'),
			div(button('.back', 'Back to Main Menu')),
			span(' '),
		])
	)

	return {
		DOM: vtree$,
		router: backClick$,
	}
}