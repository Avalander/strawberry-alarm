import {
	backgroundReducer,
	floorReducer,
	moonReducer,
} from './background'
import { elisaReducer } from './elisa'
import {
	alienReducer,
	alienDyingReducer,
	alienAttackingReducer,
	alienBulletReducer,
} from './alien'
import { terrainReducer } from './terrain'
import { flagReducer } from './flag'


const reducers = [
	backgroundReducer,
	moonReducer,
	floorReducer,
	elisaReducer,
	alienReducer,
	alienDyingReducer,
	alienAttackingReducer,
	alienBulletReducer,
	terrainReducer,
	flagReducer,
]

const spritesReducer = (state, input) =>
	reducers.reduce((acc, fn) => Object.assign(acc, fn(acc, input)), state)

export default spritesReducer
		