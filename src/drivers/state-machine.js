import { adapt } from '@cycle/run/lib/adapt'


export default function makeStateMachine() {
	return function stateMachine(state$) {
		return {
			define: states => {
				const result$ = state$
					.map(x => {
						const state = states[x]
						if (!state) {
							throw new Error(`State '${x}' not found`)
						}
						return state
					})
				return adapt(result$)
			}
		}
	}
}
