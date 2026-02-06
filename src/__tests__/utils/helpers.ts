import { NextRequest } from 'next/server';

export function jsonRequest(url: string, options?: { method?: string; body?: any; headers?: Record<string, string> }) {
  const method = options?.method || 'GET';
  const body = options?.body;
  const headers = {
    'content-type': 'application/json',
    ...(options?.headers || {}),
  };

  const init: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  // NextRequest requires absolute URL
  const absolute = url.startsWith('http') ? url : `http://localhost${url}`;
  return new NextRequest(absolute, init);
}

export async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}
