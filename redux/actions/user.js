import axios from "axios";
import { server } from "../store";

// Default 8-second timeout on all requests so frontend never hangs indefinitely
const api = axios.create({
  baseURL: server,
  withCredentials: true,
  timeout: 8000,
});

export const uploadProfilePhoto = (file) => async (dispatch) => {
  const formData = new FormData();
  formData.append("photo", file);

  const { data } = await api.put("/update/profile-photo", formData);

  dispatch({ type: "updateProfilePhoto", payload: data.photo });
  return data.photo;
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "loadUserRequest" });

    const { data } = await api.get("/me");

    dispatch({ type: "loadUserSuccess", payload: data.user });
  } catch (error) {
    // ✅ Safe access — error.response is null on network errors / timeouts
    dispatch({
      type: "loadUserFail",
      payload: error.response?.data?.message || "Could not connect to server",
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: "logoutRequest" });

    const { data } = await api.get("/logout");

    dispatch({ type: "logoutSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "logoutFail",
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};