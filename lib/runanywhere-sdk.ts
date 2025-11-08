/**
 * Local mock of a RunAnywhere.ai SDK.
 * This provides a minimal client with runTask/execute/call methods so the app
 * can function without an external package during development or testing.
 */
export class RunAnywhereClient {
  apiKey: string | undefined;
  constructor(opts: { apiKey?: string } | string | undefined) {
    if (typeof opts === 'string') this.apiKey = opts;
    else this.apiKey = opts?.apiKey;
  }

  async runTask({ task, input }: { task?: string; input?: any }) {
    return this._mockResponse('runTask', task, input);
  }

  async execute({ task, input }: { task?: string; input?: any }) {
    return this._mockResponse('execute', task, input);
  }

  async call({ task, input }: { task?: string; input?: any }) {
    return this._mockResponse('call', task, input);
  }

  private _mockResponse(method: string, task?: string, input?: any) {
    return Promise.resolve({
      provider: 'local-mock-runanywhere',
      method,
      task: task ?? 'noop',
      input: input ?? null,
      message: 'This is a mock response. Replace with a real SDK integration for production.',
      timestamp: new Date().toISOString(),
    });
  }
}

export default RunAnywhereClient;
