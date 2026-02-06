import type { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as ApiResponse<unknown>;
    const message = errorBody.message ?? "Request failed";
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
