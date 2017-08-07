import xs from 'xstream'

import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import makePIXIDriver, { clear } from 'drivers/pixi-driver'
import makeStateMachine from 'drivers/state-machine'

import {
	Game,
	GameOver,
	MainMenu,
} from 'views'

import 'main.scss'
import atlas from 'assets/sprites.json'
import textures from 'assets/sprites.png'

function main(sources) {
	const route$ = sources.router.define({
		'game': Game,
		'game-over': GameOver,
		'main-menu': MainMenu,
	})
	const view$ = route$
		.map(value => value(sources))

	const viewDom$ = view$
		.map(x => x.DOM)
		.flatten()
	const viewRouter$ = view$
		.filter(x => x.router)
		.map(x => x.router)
		.flatten()
		.startWith('main-menu')
	const viewPixi$ = view$
		.map(x => x.PIXI || xs.of(clear()))
		.flatten()

	return {
		DOM: viewDom$,
		PIXI: viewPixi$,
		router: viewRouter$,
	}
}

const drivers = {
	DOM: makeDOMDriver('#app'),
	PIXI: makePIXIDriver('#game-view', {
		resources: [ atlas ],
		screenSize: { width: 768, height: 640 },
	}),
	router: makeStateMachine(),
}

run(main, drivers)
