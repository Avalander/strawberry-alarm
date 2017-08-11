import {
	backgroundReducer,
	floorReducer,
	moonReducer,
} from './background'
import { elisaReducer } from './elisa'
import {
	alienReducer,
	alienDyingReducer,
} from './alien'
import { terrainReducer } from './terrain'


const reducers = [
	backgroundReducer,
	moonReducer,
	floorReducer,
	elisaReducer,
	alienReducer,
	alienDyingReducer,
	terrainReducer,
]

const spritesReducer = (state, input) =>
	reducers.reduce((acc, fn) => Object.assign(acc, fn(acc, input)), state)

export default spritesReducer
		