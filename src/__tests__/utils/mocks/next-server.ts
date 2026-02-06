// Some API handlers rely on NextResponse.json.
// Provide a light shim if tests run outside the Next runtime.

export function mockNextResponseJson() {
  jest.doMock('next/server', () => {
    const actual = jest.requireActual('next/server');
    return {
      ...actual,
      NextResponse: {
        json: (data: any, init?: ResponseInit) => {
          const status = init?.status ?? 200;
          return new Response(JSON.stringify(data), {
            status,
            headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
          });
        },
      },
    };
  });
}
