import { describe, expect, it, vi, beforeEach } from 'vitest'
import { readPackageJSON } from 'pkg-types'
import mod from '../src/module'

const log = console.log
const error = console.error
vi.stubGlobal('console', {
  error: vi.fn(error),
  log: vi.fn(log),
})

vi.mock('pkg-types', async (og) => {
  return {
    ...(await og<typeof import('pkg-types')>()),
    readPackageJSON: vi.fn(() => {}),
  }
})

describe('test version compat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('expect error log for nuxt kit', async () => {
    vi.mocked(readPackageJSON).mockImplementation((path) => {
      if (path?.includes('nuxt/kit')) {
        return Promise.resolve({
          version: '3.7.0',
        })
      }

      return Promise.resolve({
        version: '3.8.0',
      })
    })

    await mod({}, {
      _version: '3.8.0',
      // @ts-expect-error mock for test purpose
      options: {},
    })

    expect(vi.mocked(console.error)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(console.error).mock.lastCall).toMatchObject(['Version mismatch for @nuxt/kit and nuxt: expected 3.8.0 (nuxt) but got 3.7.0'])
  })

  it('expect no error log', async () => {
    vi.mocked(readPackageJSON).mockImplementation(() => {
      return Promise.resolve({
        version: '3.8.0',
      })
    })

    await mod({}, {
      _version: '3.8.0',
      // @ts-expect-error mock for test purpose
      options: {},
    })

    expect(vi.mocked(console.error)).not.toHaveBeenCalled()
  })
})
