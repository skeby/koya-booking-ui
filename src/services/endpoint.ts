/* eslint-disable @typescript-eslint/no-explicit-any -- generic API wrapper ported from higher-profile-ui */
import client from "./axios-client"
import { type AxiosResponse } from "axios"
import { message } from "antd"
import { QueryClient } from "@tanstack/react-query"

export const apiCall = async (
  body: any,
  path: string,
  method: string,
  extraHeaders?: any,
  headers?: any,
  params?: any,
  showLoader = false,
  tanstack?: {
    client: QueryClient
    signal?: AbortSignal
  }
) => {
  const messageId = "apicall-loading-message"

  try {
    if (showLoader) {
      message.loading({ content: "Loading", key: messageId, duration: 0 })
    }

    // A body may smuggle a `_path` override (e.g. `${paths.bookings}/${id}`)
    // and per-call `_headers` (e.g. a fresh Idempotency-Key per attempt).
    let finalPath = path
    let payload = body
    let callHeaders: Record<string, string> = {}

    if (body && typeof body === "object" && !Array.isArray(body) && !(body instanceof FormData)) {
      const { _path, _headers, ...rest } = body
      if (_path) finalPath = _path
      if (_headers) callHeaders = _headers
      payload = rest
    }

    const methodLower = method.toLowerCase()
    if (!["get", "post", "put", "patch", "delete"].includes(methodLower)) {
      throw new Error(`Unsupported method: ${method}`)
    }

    // Headers are passed per request, never written onto the shared client's
    // defaults, so a one-off header can't leak into later requests.
    const res: AxiosResponse = await client.request({
      url: finalPath,
      method: methodLower,
      data: ["get", "delete"].includes(methodLower) ? undefined : payload,
      params,
      headers: { ...extraHeaders, ...headers, ...callHeaders },
      signal: tanstack?.signal,
    })

    return res.data
  } catch (error: any) {
    if (error?.canceled) return false
    message.error(error?.error || "Something went wrong!", 6)
    return false
  } finally {
    if (showLoader) {
      message.destroy(messageId)
    }
  }
}
