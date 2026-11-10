/* eslint-disable @typescript-eslint/no-explicit-any -- generic query/mutation wrappers ported from higher-profile-ui */
import { useSearchParams as useInternalSearchParams } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../state/store"
export { useAppSelector, useAppDispatch }
import {
  type UseMutationOptions,
  useQueryClient,
  useMutation,
  type QueryFilters,
  useQuery,
  keepPreviousData,
  type DefinedInitialDataOptions,
} from "@tanstack/react-query"
import { apiCall } from "../services/endpoint"

export { useTheme } from "./use-theme"

type SetURLSearchParams = (obj: { [key: string]: string }) => void

type RemoveURLSearchParams = (keys?: string[]) => void

export type MutationData<T> = {
  mutationKey?: any[]
  path: string
  /** Runs only when the call succeeded (apiCall returns false on failure). */
  onSuccess?: (data: T) => void
  method?: string
  extraHeaders?: any
  headers?: any
  params?: any
  showLoader?: boolean
  removeQueries?: boolean
  invalidateQueries?: boolean
} & Omit<UseMutationOptions<T | false, any, unknown, unknown>, "onSuccess">

export interface QueryData<T = any> {
  data?: T
  queryKey: any[]
  path: string
  enabled?: boolean
  refetchOnMount?: boolean
  extraHeaders?: any
  headers?: any
  params?: any
  showLoader?: boolean
  gcTime?: number
  staleTime?: number
  method?: string
  /** Keep showing the last successful result while a new query key (filters/page) is fetching, instead of flashing to a loading state. */
  keepPreviousData?: boolean
  /** Error statuses the page shows its own state for, so no error toast is raised. */
  silentStatuses?: number[]
  options?: Partial<DefinedInitialDataOptions<T>>
}

export const useApp = () => {
  return useAppSelector((state) => state.app)
}

export const useSearchParams = () => {
  const [internalSearchParams, internalSetSearchParams] = useInternalSearchParams()

  const setSearchParams: SetURLSearchParams = (obj?: { [key: string]: string }) => {
    const params = new URLSearchParams(internalSearchParams)
    Object.entries(obj ?? {}).forEach(([key, value]) => {
      if (value === "") params.delete(key)
      else params.set(key, value)
    })
    internalSetSearchParams(params)
  }

  const removeSearchParams: RemoveURLSearchParams = (keys) => {
    if (!keys) {
      internalSetSearchParams({})
      return
    }
    const params = new URLSearchParams(internalSearchParams)
    keys.forEach((key) => params.delete(key))
    internalSetSearchParams(params)
  }

  return [internalSearchParams, setSearchParams, removeSearchParams] as [
    URLSearchParams,
    SetURLSearchParams,
    RemoveURLSearchParams,
  ]
}

export const useAppMutation = <T>(mutationData: MutationData<T>) => {
  const {
    mutationKey,
    path,
    onSuccess,
    onError,
    method = "post",
    extraHeaders,
    headers,
    params,
    showLoader,
    removeQueries = true,
    invalidateQueries = true,
    onMutate,
    onSettled,
  } = mutationData ?? {}
  const queryClient = useQueryClient()

  return useMutation<T | false, any, unknown>({
    mutationKey,
    onMutate,
    onSettled,
    onError,
    mutationFn: (data: any) => {
      return apiCall(data, path, method, extraHeaders, headers, params, showLoader)
    },
    onSuccess: async (data) => {
      if (data === false) return
      const predicate: QueryFilters["predicate"] = (query) => {
        return query.queryKey[0] === mutationKey?.[0]
      }
      if (invalidateQueries) {
        await queryClient.invalidateQueries({ predicate })
      } else if (removeQueries) {
        queryClient.removeQueries({ predicate })
      }
      if (onSuccess) onSuccess(data as T)
    },
  })
}

export const useAppQuery = <T>(queryData: QueryData<T>) => {
  const {
    data,
    queryKey,
    path,
    enabled,
    refetchOnMount,
    extraHeaders,
    headers,
    params,
    showLoader,
    gcTime,
    staleTime,
    method = "get",
    keepPreviousData: shouldKeepPreviousData,
    silentStatuses,
    options,
  } = queryData
  return useQuery<T>({
    queryKey,
    queryFn: ({ client, signal }) =>
      apiCall(
        data ?? {},
        path,
        method,
        extraHeaders,
        headers,
        params,
        showLoader,
        { client, signal },
        silentStatuses
      ),
    enabled,
    gcTime,
    staleTime,
    refetchOnMount: refetchOnMount ?? false,
    placeholderData: shouldKeepPreviousData ? keepPreviousData : undefined,
    ...options,
  })
}
