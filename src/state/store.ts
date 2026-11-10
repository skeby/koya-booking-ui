import { configureStore } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { persistStore, persistReducer, type PersistConfig } from "redux-persist"
import createWebStorage from "redux-persist/es/storage/createWebStorage"
import { APP_NAME_DASHED } from "../static"
import appReducer, { type AppState } from "./slices/app-slice"

type PersistStorage = {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

const createNoopStorage = (): PersistStorage => ({
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
})

const storage: PersistStorage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage()

const appPersistConfig: PersistConfig<AppState> = {
  key: `${APP_NAME_DASHED}-app-state`,
  storage,
}

export const store = configureStore({
  reducer: {
    app: persistReducer<AppState>(appPersistConfig, appReducer),
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector
