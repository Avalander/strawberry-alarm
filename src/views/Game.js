import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'

import {
	div,
	span,
} from '@cycle/dom'

import {
	draw,
	clear,
} from 'drivers/pixi-driver'

import config, { keys } from 'config'
import spritesReducer from 'reducers'
import {
	stateReducer,
	updateSpeed,
	updatePosition,
} from 'reducers/state'
import { updateCollisions } from 'collision'


const recognisedKeys = Object.values(keys)

const inputHandler = () => {
	const keyboard$ = xs.merge(
			fromEvent(window, 'keydown'),
			fromEvent(window, 'keyup'),
		)
		.filter(x => recognisedKeys.indexOf(x.keyCode) !== -1)
		.map(x => {
			x.preventDefault()
			return { type: x.type, keyCode: x.keyCode }
		})
		.compose(dropRepeats((a, b) => a.type === b.type && a.keyCode === b.keyCode))
		.fold((acc, { type, keyCode }) => {
			acc[keyCode] = type === 'keydown'
			return acc
		}, {})
	return keyboard$
}


export default function Game({ PIXI }) {
	const gameOver$ = xs.never()

	const instructionsText = `Aliens are invading your castle. Go and fight them.
	Use arrow keys to move and space to attack.`
	const vtree$ = xs.periodic(100).take(instructionsText.length + 1)
		.map(i => instructionsText.substring(0, i).split('\n'))
		.map(text => div('.column', text.map(x => span(x))))
		
	const keyboard$ = inputHandler().map(x => ({ type: 'KEYBOARD', value: x }))
	const animation$ = PIXI.animation$.map(x => ({ type: 'ANIMATION', value: x }))
	const state$ = xs.merge(keyboard$, animation$)
		.fold(stateReducer)
		.filter(x => x !== undefined)

	const sprites$ = xs.combine(state$, xs.periodic(100))
		.map(updateSpeed)
		.map(updatePosition)
		.map(updateCollisions)
		.fold(spritesReducer, {})
		.map(x => draw(Object.values(x)))
	
	
	return {
		DOM: vtree$,
		PIXI: sprites$,
		router: gameOver$,
	}
}