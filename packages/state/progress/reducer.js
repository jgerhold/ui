import { handleActions } from 'redux-actions'
import { SIMULATE_PLAYTIME, ENABLE_GHOST_MODE, DISABLE_GHOST_MODE } from '@podlove/actions/types'
import { toInt } from '@podlove/utils/helper'

export const INITIAL_STATE = {
  ghost: null
}

export const reducer = handleActions({
  [SIMULATE_PLAYTIME]: (state, { payload }) => ({
    ...state,
    ghost: toInt(payload)
  }),

  [ENABLE_GHOST_MODE]: (state) => ({
    ...state
  }),

  [DISABLE_GHOST_MODE]: (state) => ({
    ...state,
    ghost: null
  })
}, INITIAL_STATE)
