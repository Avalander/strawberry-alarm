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
		div('.content', [
			h1('Strawberry Alert'),
			div(button('.play', 'Play')),
		])
	)

	return {
		DOM: vtree$,
		router: playClick$,
	}
}