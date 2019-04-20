import { put, takeEvery } from 'redux-saga/effects'
import {
  BACKEND_PLAY,
  BACKEND_PAUSE,
  BACKEND_LOADING_START,
  BACKEND_LOADING_END
} from '@podlove/player-actions/types'
import {
  showPlayingButton,
  showLoadingButton,
  showPauseButton,
  showProgressBar,
  showSteppersControls,
  showChapterControls
} from '@podlove/player-actions/components'

export function* componentsSaga() {
  yield takeEvery(BACKEND_PLAY, play)
  yield takeEvery(BACKEND_PAUSE, pause)
  yield takeEvery(BACKEND_LOADING_START, loading)
  yield takeEvery(BACKEND_LOADING_END, loaded)
}

export function* play() {
  yield put(showPlayingButton())
  yield put(showProgressBar())
  yield put(showSteppersControls())
  yield put(showChapterControls())
}

export function* pause() {
  yield put(showPauseButton())
}

export function* loading() {
  yield put(showLoadingButton())
}

export function* loaded({ payload }) {
  if (payload.paused) {
    yield put(showPauseButton())
  } else {
    yield put(showPlayingButton())
  }
}
