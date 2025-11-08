/**
 * Lightweight wrapper for a RunAnywhere.ai SDK.
 * - Uses dynamic import so the app won't crash if the package is not installed.
 * - Expects RUNANYWHERE_API_KEY to be set in environment for server-side calls.
 *
 * Usage:
 *   const res = await runAnywhereExecute({ task: 'echo hello', input: {} })
 */
export async function runAnywhereExecute(payload: { task?: string; input?: any }) {
  const apiKey = process.env.RUNANYWHERE_API_KEY;
  if (!apiKey) {
    throw new Error('RUNANYWHERE_API_KEY not set in environment');
  }

  let sdk: any;
  try {
    // dynamic import so code doesn't fail at module-resolve time if package missing
    sdk = await import('runanywhere-ai');
  } catch (err) {
    // Fallback to a local mock SDK included in this repo.
    // This lets the project work even if an official package isn't available.
    try {
      sdk = await import('./runanywhere-sdk.js');
    } catch (err2) {
      throw new Error(
        'The `runanywhere-ai` package is not installed and the local fallback failed to load. Install a real SDK or check the local mock.'
      );
    }
  }

  // Try common client shapes. SDKs vary; adapt if you use a specific one.
  const Client = sdk.RunAnywhereClient ?? sdk.default ?? sdk;

  const client = new Client({ apiKey });

  // Prefer runTask, then execute, then a generic call.
  if (typeof client.runTask === 'function') {
    return await client.runTask({ task: payload.task, input: payload.input });
  }
  if (typeof client.execute === 'function') {
    return await client.execute({ task: payload.task, input: payload.input });
  }
  if (typeof client.call === 'function') {
    return await client.call({ task: payload.task, input: payload.input });
  }

  throw new Error('Installed runanywhere-ai SDK has no supported client API (runTask/execute/call)');
}

export type RunAnywherePayload = { task?: string; input?: any };
