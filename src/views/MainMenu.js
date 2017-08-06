import xs from 'xstream'

import {
	button,
	div,
	h1,
} from '@cycle/dom'


export default function MainMenu({ DOM }) {
	const playClick$ = DOM.select('.play').events('click')
		.mapTo('game')

	const vtree$ = xs.of(
		div([
			h1('Main Menu!'),
			button('.play', 'Play')
		])
	)

	return {
		DOM: vtree$,
		router: playClick$,
	}
}