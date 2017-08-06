import xs from 'xstream'

import {
	button,
	div,
	h1,
} from '@cycle/dom'


export default function GameOver({ DOM }) {
	const backClick$ = DOM.select('.back').events('click')
		.mapTo('main-menu')
	
	const vtree$ = xs.of(
		div([
			h1('Game Over!'),
			button('.back', 'Back to Main Menu')
		])
	)

	return {
		DOM: vtree$,
		router: backClick$,
	}
}