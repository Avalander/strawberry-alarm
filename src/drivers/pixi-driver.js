import {
	Application,
	Container,
	Sprite,
	Text,
	loader,
} from 'pixi.js'
import {
	AnimatedSprite,
	TilingSprite,
} from 'pixi.js/lib/extras'

import xs from 'xstream'


const onProgress = (loader, resource) => console.log(`Loading... ${loader.progress}% - '${resource.url}'`)

const getTexture = ([ spritesheet, id ]) => loader.resources[spritesheet].textures[id]

const spriteProps = [
	'rotation',
	'buttonMode',
	'loop',
	'visible',
]
const updateSprite = (sprite, data) => {
	if (data.position) sprite.position.set(data.position.x, data.position.y)
	if (data.hasOwnProperty('anchor')) sprite.anchor.set(data.anchor)
	if (data.hasOwnProperty('tilePosition')) {
		sprite.tilePosition.x = data.tilePosition.x
		sprite.tilePosition.y = data.tilePosition.y
	}
	spriteProps.forEach(prop => {
		if (data.hasOwnProperty(prop)) sprite[prop] = data[prop]
	})
	return sprite
}

const updateAnimation = (sprite, play, animation$) => {
	if (!play) return
	sprite.play()
	sprite.onLoop = () => {
		sprite.stop()
		animation$.shamefullySendNext(play)
	}
}

const create = {
	'sprite': ({ texture }) => new Sprite(getTexture(texture)),
	'animatedSprite': ({ frames, props, start }) => {
		const sprite = new AnimatedSprite(frames.map(getTexture))
		sprite.animationSpeed = props.animationSpeed || 1
		if (start) {
			sprite.play()
		}
		return sprite
	},
	'tilingSprite': ({ texture, props }) => new TilingSprite(getTexture(texture), props.width, props.height),
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

const Main = (app, sprites$, interaction$, animation$) => () => {
	const spritesLookup = {}

	sprites$.addListener({
		next: ({ action, sprites }) => {
			if (action === 'clear') {
				app.stage.removeChildren()
				return
			}
			sprites.forEach(data => {
				let sprite = spritesLookup[data.key]
				if (!sprite) {
					sprite = create[data.type](data)
					app.stage.addChild(sprite)
					spritesLookup[data.key] = sprite
				}
				updateSprite(sprite, data.props)
				updateInteraction(sprite, data.props, interaction$)
				updateAnimation(sprite, data.play, animation$)
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
		const animation$ = xs.create()
		
		resources.forEach(r => loader.add(r))
		loader.on('progress', onProgress)
			.load(Main(app, sprites$, interaction$, animation$))

		return {
			tick$: TimeSource(app),
			interaction$,
			animation$,
		}
	}
}

export const draw = (sprites) => ({ action: 'draw', sprites })
export const clear = () => ({ action: 'clear' })

export const sprite = ({ key=Symbol(), texture, props }) => ({ key, type: 'sprite', texture, props })
export const tilingSprite = ({ key=Symbol(), texture, props }) => ({ key, type: 'tilingSprite', texture, props })
export const animatedSprite = ({ key=Symbol(), frames, props, start }) => ({ key, type: 'animatedSprite', frames, props, start })