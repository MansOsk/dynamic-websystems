import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  SET_CURRENT_MANAGER,
  MANAGER_LOADING,
  SET_ROLE
} from "./types";

export const setUserTimeout = (id) => dispatch => {
  axios
    .put("/api/household/" + id + "/timeout")
    .then(res => {
      console.log("setUserTimeout");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update whatever
export const updateDatabase = (userType, dbData ,data) => dispatch => {
  axios
    .put("api/" + userType + data, dbData)
    .then(res => {
      console.log("updateDatabase");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//not in use?
export const displayDatabase = (data, dbData) => dispatch => {
  axios
    .get("api/household/" + data, dbData)
    .then(res => {
      console.log("Display database");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// Edit user
export const editUser = (userType, dbData ,data) => dispatch => {
  axios
    .put("/api/" + userType + data, dbData)
    .then(res => {
      console.log("editUser");


    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("api/user/register", userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Login - get user token
export const loginUser = (userType ,userData, history) => dispatch => {
  console.log("loginUser");
  axios
    .post("api/" + userType + "/login", userData)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);

      if(userType==="manager"){
        // Set current manager
        dispatch(setCurrentUser(decoded));
        history.push("/managerdashboard")
      }else{
        // Set current user
        dispatch(setCurrentUser(decoded));
        history.push("/dashboard");
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Set logged in manager
export const setCurrentManager = decoded => {
  return {
    type: SET_CURRENT_MANAGER,
    payload: decoded
  };
};
// Manager loading
export const setManagerLoading = () => {
  return {
    type: MANAGER_LOADING
  };
};

// Set user to manager
export const setRole = () => {
  return {
    type: SET_ROLE
  };
};

// Log user out, maybe a redirect?
export const logoutManager = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const logoutUser = (status, data) => dispatch => {
  axios
    .put("api/user/" + data, status)
    .then(res => {
      console.log("logoutuser");
      // Remove token from local storage
      localStorage.removeItem("jwtToken");
      // Remove auth header for future requests
      setAuthToken(false);
      // Set current user to empty object {} which will set isAuthenticated to false
      dispatch(setCurrentUser({}));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};