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


const reducers = [
	backgroundReducer,
	moonReducer,
	floorReducer,
	elisaReducer,
	alienReducer,
	alienDyingReducer,
]

const spritesReducer = (state, input) =>
	reducers.reduce((acc, fn) => Object.assign(acc, fn(acc, input)), state)

export default spritesReducer
		