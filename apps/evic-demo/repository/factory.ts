import { demoRequest } from '../demo/store'
import { FetchError } from '../demo/error'

class HttpFactory {
  async call<T>(method: string, url: string, data?: object): Promise<T> {
    try {
      return await demoRequest(method, url, data) as T
    } catch (error) {
      throw new FetchError(error instanceof Error ? error.message : 'Demo operation failed.')
    }
  }
}

export default HttpFactory
