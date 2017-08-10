import xs from 'xstream'

import {
	button,
	div,
	h1,
	span,
} from '@cycle/dom'


export default function MainMenu({ DOM }) {
	const playClick$ = DOM.select('.play').events('click')
		.mapTo('game')

	const vtree$ = xs.of(
		div('.content', [
			h1('Strawberry Alert'),
			div(button('.play', 'Play')),
			span('Created by Avalander'),
		])
	)

	return {
		DOM: vtree$,
		router: playClick$,
	}
}