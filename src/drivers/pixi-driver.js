import {
	Application,
	Container,
	Sprite,
	loader,
} from 'pixi.js'

import xs from 'xstream'


const onProgress = (loader, resource) => console.log(`Loading... ${loader.progress}% - '${resource.url}'`)

const getTexture = ([ spritesheet, id ]) => loader.resources[spritesheet].textures[id]

const updateSprite = (sprite, data) => {
	if (data.position) sprite.position.set(data.position.x, data.position.y)
	if (data.hasOwnProperty('anchor')) sprite.anchor.set(data.anchor)
	if (data.hasOwnProperty('rotation')) sprite.rotation = data.rotation
	if (data.hasOwnProperty('buttonMode')) sprite.buttonMode = data.buttonMode
	return sprite
}

const createSprite = (data) => {
	return new Sprite(getTexture(data.texture))
}

const TimeSource = (app) => {
	let _listener
	return xs.create({
		start: (listener) => {
			_listener = delta => listener.next(delta)
			app.ticker.add(_listener)
		},
		stop: () => app.ticker.remove(_listener),
	})
}

const updateInteraction = (sprite, data, interaction$) => {
	if (!data.hasOwnProperty('interactive') || sprite.interactive === data.interactive) {
		return
	}
	sprite.interactive = data.interactive
	if (sprite.interactive) {
		sprite.on('pointerdown', () => interaction$.shamefullySendNext({ target: data.name }))
	}
	else {
		sprite.removeAllListeners('pointerdown')
	}
}

const Main = (app, sprites$, interaction$) => () => {
	const spritesLookup = {}

	const unnamed = new Container()
	app.stage.addChild(unnamed)
	const named = new Container()
	app.stage.addChild(named)

	sprites$.addListener({
		next: ({ action, sprites }) => {
			if (action === 'clear') {
				unnamed.removeChildren()
				named.removeChildren()
				return
			}
			sprites.forEach(data => {
				if (!data.name) {
					unnamed.addChild(updateSprite(createSprite(data), data))
					return
				}
				let sprite = spritesLookup[data.name]
				if (!sprite) {
					sprite = createSprite(data)
					named.addChild(sprite)
					spritesLookup[data.name] = sprite
				}
				updateSprite(sprite, data)
				updateInteraction(sprite, data, interaction$)
			})
		}
	})
}

export default function makePIXIDriver(root, { resources=[], screenSize }) {
	return (sprites$) => {
		const app = new Application(screenSize.width, screenSize.height, {
			transparent: true,
		})
		document.querySelector(root).appendChild(app.view)

		const interaction$ = xs.create()
		
		resources.forEach(r => loader.add(r))
		loader.on('progress', onProgress)
			.load(Main(app, sprites$, interaction$))

		return {
			tick$: TimeSource(app),
			interaction$,
		}
	}
}

export const draw = (sprites) => ({ action: 'draw', sprites })
export const clear = () => ({ action: 'clear' })