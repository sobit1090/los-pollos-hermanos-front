import axios from "axios";
import { server } from "../store";
export const uploadProfilePhoto = (file) => async (dispatch) => {
   
    const formData = new FormData();
    formData.append("photo", file);

    const { data } = await axios.put(
      `${server}/update/profile-photo`,
      formData,
      { withCredentials: true }
    );

    // ✅ Update Redux state instantly
    dispatch({ type: "updateProfilePhoto", payload: data.photo });

    return data.photo; // ✅ Needed so component can continue
   
    
};
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadUserRequest",
    });

    const { data } = await axios.get(`${server}/me`, {
      withCredentials: true,
    });

    dispatch({
      type: "loadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "loadUserFail",
      payload: error.response.data.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({
      type: "logoutRequest",
    });

    const { data } = await axios.get(`${server}/logout`, {
      withCredentials: true,
    });

    dispatch({
      type: "logoutSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "logoutFail",
      payload: error.response.data.message,
    });
  }
};