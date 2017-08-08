import {
	backgroundReducer,
	floorReducer,
	moonReducer,
} from './background'
import { elisaReducer } from './elisa'
import { alienReducer } from './alien'


const reducers = [
	backgroundReducer,
	moonReducer,
	floorReducer,
	elisaReducer,
	//alienReducer,
]

const gameStateReducer = (state, input) =>
	reducers.reduce((acc, fn) => Object.assign(acc, fn(acc, input)), state)

export default gameStateReducer
		