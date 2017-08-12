import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'
import delay from 'xstream/extra/delay'

import {
	div,
	h2,
	span,
} from '@cycle/dom'

import {
	draw,
	clear,
} from 'drivers/pixi-driver'

import config, { keys } from 'config'
import spritesReducer from 'reducers'
import {
	playerStateMapper,
	gameStateReducer,
	updateCamera,
	updateSpeed,
	updatePosition,
	updateVisible,
	updateAliens,
} from 'reducers/state'
import spritesToDraw from 'reducers/render'

import {
	updateCollisions,
	collisionWithFlag,
} from 'collision'


const recognisedKeys = Object.values(keys)

const inputHandler = () => {
	const keyboard$ = xs.merge(
			fromEvent(window, 'keydown'),
			fromEvent(window, 'keyup'),
		)
		.filter(x => recognisedKeys.indexOf(x.keyCode) !== -1)
		.map(x => {
			x.preventDefault()
			return { type: x.type, value: x.keyCode }
		})
		.compose(dropRepeats((a, b) => a.type === b.type && a.value === b.value))
	return keyboard$
}

const instructionsText = `Aliens are invading your castle. Go and fight them.
Use arrow keys to move and space to attack.`

export default function Game({ PIXI }) {
	const instructionsText$ = xs.periodic(50).take(instructionsText.length + 1)
		.map(i => instructionsText.substring(0, i).split('\n'))
		.map(text => div('.column', text.map(x => span(x))))
		
	const keyboard$ = inputHandler()
	const animation$ = PIXI.animation$.map(x => ({ type: 'ANIMATION', value: x }))
	const state$ = xs.merge(keyboard$, animation$)
		.map(playerStateMapper)
		.startWith(() => {})

	const spritesAfterCollisions$ = xs.combine(state$, PIXI.tick$)
		.fold(gameStateReducer)
		.filter(x => x !== undefined)
		.map(updateCamera)
		.map(updateVisible('aliens'))
		.map(updateVisible('terrain'))
		.map(updateSpeed)
		.map(updatePosition)
		.map(updateAliens)
		.map(updateCollisions)
	
	const sprites$ = spritesAfterCollisions$
		.fold(spritesReducer, {})
		.filter(x => x.moon)
		.map(spritesToDraw)
	
	const gameOver$ = spritesAfterCollisions$
		.map(collisionWithFlag)
		.filter(x => x)
		.mapTo('game-over')
	
	const victoryText$ = gameOver$
		.mapTo(div('.center', div('.window', h2('Level finished!'))))
	
	const vtree$ = xs.merge(instructionsText$, victoryText$)
	
	return {
		DOM: vtree$,
		PIXI: sprites$,
		router: gameOver$.compose(delay(1500)),
	}
}