import {
  chaptersSaga,
  initChapters,
  chapterUpdate,
  setChapter,
  resetChapter,
  previousChapter,
  nextChapter
} from './chapters'
import {
  INIT,
  REQUEST_PLAYTIME,
  BACKEND_PLAYTIME,
  SET_CHAPTER,
  DISABLE_GHOST_MODE,
  PREVIOUS_CHAPTER,
  NEXT_CHAPTER
} from '@podlove/player-actions/types'
import * as chapter from '@podlove/player-actions/chapters'
import { requestPlaytime } from '@podlove/player-actions/timepiece'
import { takeEvery, select, put } from 'redux-saga/effects'

describe('chapters', () => {
  let selectDuration, selectPlaytime, selectCurrentChapter, selectChapterList

  beforeEach(() => {
    selectDuration = jest.fn()
    selectPlaytime = jest.fn()
    selectCurrentChapter = jest.fn()
    selectChapterList = jest.fn()
  })

  describe('chaptersSaga()', () => {
    test('should export a factory', () => {
      expect(
        typeof chaptersSaga({
          selectDuration,
          selectPlaytime,
          selectCurrentChapter,
          selectChapterList
        })
      ).toBe('function')
    })

    test('should return a generator', () => {
      const saga = chaptersSaga({
        selectDuration,
        selectPlaytime,
        selectCurrentChapter,
        selectChapterList
      })
      expect(typeof saga().next).toBe('function')
    })

    test('should register chapter actions', () => {
      const saga = chaptersSaga({
        selectDuration,
        selectPlaytime,
        selectCurrentChapter,
        selectChapterList
      })
      const gen = saga()

      expect(gen.next().value).toEqual(
        takeEvery(INIT, initChapters, {
          selectDuration,
          selectPlaytime,
          selectCurrentChapter,
          selectChapterList
        })
      )
      expect(gen.next().value).toEqual(takeEvery(REQUEST_PLAYTIME, chapterUpdate))
      expect(gen.next().value).toEqual(takeEvery(BACKEND_PLAYTIME, chapterUpdate))
      expect(gen.next().value).toEqual(
        takeEvery(SET_CHAPTER, setChapter, {
          selectDuration,
          selectPlaytime,
          selectCurrentChapter,
          selectChapterList
        })
      )
      expect(gen.next().value).toEqual(
        takeEvery(DISABLE_GHOST_MODE, resetChapter, {
          selectDuration,
          selectPlaytime,
          selectCurrentChapter,
          selectChapterList
        })
      )
      expect(gen.next().value).toEqual(
        takeEvery(PREVIOUS_CHAPTER, previousChapter, {
          selectDuration,
          selectPlaytime,
          selectCurrentChapter,
          selectChapterList
        })
      )
      expect(gen.next().value).toEqual(
        takeEvery(NEXT_CHAPTER, nextChapter, {
          selectDuration,
          selectPlaytime,
          selectCurrentChapter,
          selectChapterList
        })
      )
      expect(gen.next().done).toBeTruthy()
    })
  })

  describe('chapterUpdate()', () => {
    test('should be a generator', () => {
      expect(typeof chapterUpdate({ payload: 'foo' }).next).toBe('function')
    })

    test('should dispatch UPDATE_CHAPTER', () => {
      const gen = chapterUpdate({ payload: 'foo' })
      expect(gen.next().value).toEqual(put(chapter.updateChapter('foo')))
      expect(gen.next().done).toBeTruthy()
    })
  })

  describe('setChapter()', () => {
    test('should be a generator', () => {
      expect(typeof setChapter({ selectCurrentChapter }).next).toBe('function')
    })

    test('should select the current chapter', () => {
      const gen = setChapter({ selectCurrentChapter })
      expect(gen.next().value).toEqual(select(selectCurrentChapter))
    })

    test('should dispatch REQUEST_PLAYTIME with the current chapter start', () => {
      const gen = setChapter({ selectCurrentChapter })
      gen.next()
      expect(gen.next({ start: 1337 }).value).toEqual(put(requestPlaytime(1337)))
      expect(gen.next().done).toBeTruthy()
    })
  })

  describe('resetChapter()', () => {
    test('should be a generator', () => {
      expect(typeof resetChapter({ selectPlaytime }).next).toBe('function')
    })

    test('should select the current playtime', () => {
      const gen = resetChapter({ selectPlaytime })
      expect(gen.next().value).toEqual(select(selectPlaytime))
    })

    test('should dispatch UPDATE_CHAPTER with the current playtime', () => {
      const gen = resetChapter({ selectPlaytime })
      gen.next()
      expect(gen.next(1337).value).toEqual(put(chapter.updateChapter(1337)))
      expect(gen.next().done).toBeTruthy()
    })
  })

  describe('previousChapter()', () => {
    test('should be a generator', () => {
      expect(typeof previousChapter({ selectPlaytime, selectCurrentChapter }).next).toBe('function')
    })

    test('should select the current playtime', () => {
      const gen = previousChapter({ selectPlaytime, selectCurrentChapter })
      expect(gen.next().value).toEqual(select(selectPlaytime))
    })

    test('should select the current chapter', () => {
      const gen = previousChapter({ selectPlaytime, selectCurrentChapter })
      gen.next()
      expect(gen.next().value).toEqual(select(selectCurrentChapter))
    })

    test('should dispatch PREVIOUS_CHAPTER if the playtime is nearly at chapters start', () => {
      const gen = previousChapter({ selectPlaytime, selectCurrentChapter })
      gen.next()
      gen.next(22000)
      expect(gen.next({ start: 20000, index: 1 }).value).toEqual(put(chapter.previousChapter()))
      expect(gen.next().done).toBeTruthy()
    })

    test('should dispatch SET_CHAPTER if the playtime is way above the chapters start', () => {
      const gen = previousChapter({ selectPlaytime, selectCurrentChapter })
      gen.next()
      gen.next(24000)
      expect(gen.next({ start: 20000, index: 1 }).value).toEqual(put(chapter.setChapter(0)))
      expect(gen.next().done).toBeTruthy()
    })
  })

  describe('nextChapter()', () => {
    test('should be a generator', () => {
      expect(
        typeof nextChapter({
          selectDuration,
          selectPlaytime,
          selectChapterList,
          selectCurrentChapter
        }).next
      ).toBe('function')
    })

    test('should select the duration', () => {
      const gen = nextChapter({
        selectDuration,
        selectPlaytime,
        selectChapterList,
        selectCurrentChapter
      })
      expect(gen.next().value).toEqual(select(selectDuration))
    })

    test('should select the playtime', () => {
      const gen = nextChapter({
        selectDuration,
        selectPlaytime,
        selectChapterList,
        selectCurrentChapter
      })
      gen.next()
      expect(gen.next().value).toEqual(select(selectPlaytime))
    })

    test('should select the chapters list', () => {
      const gen = nextChapter({
        selectDuration,
        selectPlaytime,
        selectChapterList,
        selectCurrentChapter
      })
      gen.next()
      gen.next()
      expect(gen.next().value).toEqual(select(selectChapterList))
    })

    test('should select the current chapter', () => {
      const gen = nextChapter({
        selectDuration,
        selectPlaytime,
        selectChapterList,
        selectCurrentChapter
      })
      gen.next()
      gen.next()
      gen.next()
      expect(gen.next().value).toEqual(select(selectCurrentChapter))
    })

    test('should dispatch REQUEST_PLAYTIME with the next chapter start', () => {
      const gen = nextChapter({
        selectDuration,
        selectPlaytime,
        selectChapterList,
        selectCurrentChapter
      })
      gen.next()
      gen.next(50000)
      gen.next(10000)
      gen.next([{ start: 0 }, { start: 10000 }, { start: 20000 }])
      expect(gen.next({ start: 10000, index: 1 }).value).toEqual(put(requestPlaytime(10000)))
      expect(gen.next().done).toBeTruthy()
    })
  })

  describe('initChapters()', () => {
    const chapters = [
      {
        start: '00:10',
        title: 'chapter-1',
        image: 'chapter-image-1',
        href: 'http://chapter-href-1.bar'
      },
      {
        start: '00:20',
        title: 'chapter-2',
        image: 'chapter-image-2',
        href: 'http://chapter-href-2.bar'
      },
      {
        start: '00:30',
        title: 'chapter-3',
        image: 'chapter-image-3',
        href: 'http://chapter-href-3.bar'
      }
    ]

    test('should be a generator', () => {
      expect(typeof initChapters({ selectDuration }, { payload: { chapters } }).next).toBe(
        'function'
      )
    })

    test('should select the duration', () => {
      const gen = initChapters({ selectDuration }, { payload: { chapters } })
      expect(gen.next().value).toEqual(select(selectDuration))
    })

    test('should dispatch SET_CHAPTERS_LIST with parsed chapters', () => {
      const gen = initChapters({ selectDuration }, { payload: { chapters } })
      gen.next(50000)
      expect(gen.next().value).toEqual(
        put(
          chapter.setChapters([
            {
              end: 20000,
              href: 'http://chapter-href-1.bar',
              image: 'chapter-image-1',
              index: 1,
              linkTitle: 'chapter-href-1.bar',
              start: 10000,
              title: 'chapter-1'
            },
            {
              end: 30000,
              href: 'http://chapter-href-2.bar',
              image: 'chapter-image-2',
              index: 2,
              linkTitle: 'chapter-href-2.bar',
              start: 20000,
              title: 'chapter-2'
            },
            {
              end: 0,
              href: 'http://chapter-href-3.bar',
              image: 'chapter-image-3',
              index: 3,
              linkTitle: 'chapter-href-3.bar',
              start: 30000,
              title: 'chapter-3'
            }
          ])
        )
      )
    })
  })
})
