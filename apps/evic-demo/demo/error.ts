export class FetchError extends Error {
  data: { message: string }

  constructor(message: string) {
    super(message)
    this.data = { message }
  }
}
