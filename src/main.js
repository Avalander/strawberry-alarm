import xs from 'xstream'

import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'

import { makeRouterDriver } from 'cyclic-router'
import createHistory from 'history/createBrowserHistory'
import switchPath from 'switch-path'

import makePIXIDriver from 'drivers/pixi-driver'
import makeStateMachine from 'drivers/state-machine'

import {
	Game,
	GameOver,
	MainMenu,
} from 'views'

import 'main.scss'


function main(sources) {
	const matchRoute$ = sources.router.define({
		'/game': Game,
		'/game-over': GameOver,
		'/main-menu': MainMenu,
	})

	const route$ = sources.router.define({
		'game': Game,
		'game-over': GameOver,
		'main-menu': MainMenu,
	})
	const view$ = route$
		.map(value => value(sources))

	/*
	const view$ = matchRoute$.map(({ path, value }) => value({
		...sources,
		router: sources.router.path(path),
	}))
	*/
	const viewDom$ = view$
		.map(x => x.DOM)
		.flatten()
	const viewRouter$ = view$
		.filter(x => x.router)
		.map(x => x.router)
		.flatten()
		.startWith('main-menu')
	const viewPixi$ = view$
		.map(x => x.PIXI || [])
		.flatten()

	return {
		DOM: viewDom$,
		router: viewRouter$,
	}
}

const drivers = {
	DOM: makeDOMDriver('#app'),
	//router: makeRouterDriver(createHistory(), switchPath),
	PIXI: makePIXIDriver('#game-view', {
		resources: [],
		screenSize: { width: 768, height: 640 },
	}),
	router: makeStateMachine(),
}

run(main, drivers)
