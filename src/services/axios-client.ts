import axios from "axios"
import { Utils } from "../utils"

const client = axios.create({
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
  timeoutErrorMessage: "Request timed out. Please try again.",
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // An aborted query (unmount, newer key) is not an error to show anyone.
    if (axios.isCancel(error)) return Promise.reject({ canceled: true })

    const status = error.response?.status
    const serverMessage = error.response?.data?.error || error.response?.data?.message

    if (status >= 400) {
      return Promise.reject({
        status,
        error: Utils.sentence(serverMessage) || "An error occurred on the server.",
      })
    }

    if (error?.message === "Network Error") {
      return Promise.reject({
        error: "Network error. Please check your internet connection.",
      })
    }

    return Promise.reject({ error: error.message || "Something went wrong!" })
  }
)

export default client
