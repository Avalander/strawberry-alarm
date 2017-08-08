import { backgroundReducer, floorReducer } from './background'
import { elisaReducer } from './elisa'


const reducers = [
	backgroundReducer,
	floorReducer,
	elisaReducer,
]

const gameStateReducer = (state, input) =>
	reducers.reduce((acc, fn) => Object.assign(acc, fn(acc, input)), state)

export default gameStateReducer
		