import { type PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface AppState {
  themeOverride: "light" | "dark" | null // null means follow the system
}

const initialState: AppState = {
  themeOverride: null,
}

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setThemeOverride: (state, action: PayloadAction<"light" | "dark" | null>) => {
      state.themeOverride = action.payload
    },
    resetAppSlice: () => {
      return { ...initialState }
    },
  },
})

export default AppSlice.reducer
export const { setThemeOverride, resetAppSlice } = AppSlice.actions
