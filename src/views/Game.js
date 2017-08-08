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
import gameStateReducer from 'reducers'


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
	const action$ = xs.merge(keyboard$, animation$)
		.fold((acc, { type, value }) => {
			switch (type) {
				case 'ANIMATION':
					if (value === 'elisa-attack') return 'idle'
					break
				case 'KEYBOARD':
					if (acc === 'attack') return acc
					if (value[keys.space]) return 'attack'
					if (value[keys.right]) return 'move'
					return 'idle'
			}
		}, 'idle')

	const state$ = xs.combine(action$, xs.periodic(100))
		.fold(gameStateReducer, {})
		.map(x => draw(Object.values(x)))
	
	
	return {
		DOM: vtree$,
		PIXI: state$,
		router: gameOver$,
	}
}