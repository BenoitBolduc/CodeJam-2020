import config from './config.json'

class Either {
  constructor(left, right) {
    this._left = left
    this._right = right
  }

  static left(data) {
    return new Either(data, null)
  }

  static right(data) {
    return new Either(null, data)
  }

  isRight() {
    return this._right !== null
  }

  isLeft() {
    return this._left !== null
  }

  left() {
    return this._left
  }

  right() {
    return this._right
  }

  map(f) {
    if (!this.isLeft()) return
    return new Either(f(this.left()), null)
  }

  leftOr(x) {
    if (!this.isLeft()) return x
    return this.left()
  }
}

async function fetchData(path) {
  try {
    const response = await fetch(config.apiUrl + path)
    const result = await response.json()
    if (!result.success) {
      return Either.right(result.error)
    }

    return Either.left(result.data)
  } catch (error) {
    return Either.right(error)
  }
}

export function fetchType(type) {
  if (type === 'compliment') return fetchCompliment()
  if (type === 'joke') return fetchJoke()
  if (type === 'activity') return fetchActivity()
}

export function fetchCompliment() {
  return fetchData('/compliment')
}

export function fetchActivity() {
  return fetchData('/activity')
}

export function fetchJoke() {
  return fetchData('/joke')
}
