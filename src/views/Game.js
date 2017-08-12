import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'
import delay from 'xstream/extra/delay'

import {
	button,
	div,
	h2,
	img,
	span,
} from '@cycle/dom'

import {
	draw,
	clear,
} from 'drivers/pixi-driver'

import R from 'ramda'

import config, { keys, alienStates } from 'config'
import spritesReducer from 'reducers'
import {
	playerStateMapper,
	gameStateReducer,
	updateCamera,
	updateJumpSpeed,
	updateSpeed,
	updatePosition,
	updateVisible,
	updateAliens,
	updateBullets,
	playerIsAlive,
} from 'reducers/state'
import spritesToDraw from 'reducers/render'

import {
	updateCollisions,
	collisionWithFlag,
} from 'collision'

import heartImg from 'assets/heart.png'


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

export default function Game({ DOM, PIXI }) {
	const instructionsText$ = xs.periodic(50).take(instructionsText.length + 1)
		.map(i => instructionsText.substring(0, i).split('\n'))
		.map(text => div('.column', text.map(x => span(x))))
		
	const keyboard$ = inputHandler()
	const animation$ = PIXI.animation$.map(x => ({ type: 'ANIMATION', value: x }))
	const state$ = xs.merge(keyboard$, animation$)
		.map(playerStateMapper)
		.startWith([() => {}])

	const spritesAfterCollisions$ = xs.combine(state$, PIXI.tick$)
		.fold(gameStateReducer)
		.filter(x => x !== undefined)
		.filter(playerIsAlive)
		.map(updateCamera)
		.map(updateVisible('aliens'))
		.map(updateVisible('terrain'))
		.map(updateVisible('bullets'))
		.map(updateJumpSpeed)
		.map(updateSpeed)
		.map(updatePosition)
		.map(updateAliens)
		.map(updateBullets)
		.map(updateCollisions)
	
	const sprites$ = spritesAfterCollisions$
		.fold(spritesReducer, {})
		.filter(x => x.moon)
		.map(spritesToDraw)
	
	const gameOver$ = spritesAfterCollisions$
		.map(collisionWithFlag)
		.filter(x => x)
	
	const victoryText$ = xs.combine(gameOver$, spritesAfterCollisions$)
		.map(([ _, [{ aliens }]]) => div('.center', div('.window', [
			h2('Level finished!'),
			div('.column', span(`Aliens defeated: ${aliens.filter(x => x.state === alienStates.dying).length}`)),
			div('.column', span(`Aliens escaped: ${aliens.filter(x => x.state !== alienStates.dying).length}`)),
			button('.next', 'Continue'),
		])))
	
	const defeatText$ = spritesAfterCollisions$
		.filter(([{ player }]) => player.hitPoints <= 0)
		.mapTo(div('.center', div('.window', [
			h2('You lost!'),
			button('.retry', 'Retry'),
		])))
	
	const heartsVtree$ = spritesAfterCollisions$
		.map(([{ player }]) => div('.hearts',
			R.range(0, player.hitPoints).map(i => img('.heart', {
				attrs: { src: heartImg },
			}))))
	
	const vtree$ = xs.combine(xs.merge(instructionsText$, victoryText$, defeatText$), heartsVtree$)
		.map(x => div(x))

	const next$ = DOM.select('.next').events('click')
		.mapTo('game-over')
	const retry$ = DOM.select('.retry').events('click')
		.mapTo('game')
	const router$ = xs.merge(next$, retry$)
	
	return {
		DOM: vtree$,
		PIXI: sprites$,
		router: router$,
	}
}