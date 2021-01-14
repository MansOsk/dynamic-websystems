import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  SET_CURRENT_MANAGER,
  MANAGER_LOADING,
  CURRENT_TYPE
} from "./types";

// Update ratio
export const updateDatabase = (dbData ,data) => dispatch => {
  axios
    .put("api/household/" + data, dbData)
    .then(res => {
      const base = dbData;
      console.log("authAction updateDatabase");

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
      console.log("authActions DisplayDatabase");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

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
export const loginUser = (userType,userData, history) => dispatch => {
  console.log("userType(role):", userType);
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

      if(userType=="manager"){
        // Set current manager
        dispatch(setCurrentManager(decoded));
        dispatch(setWho(userType));
        console.log("manager login success");
        history.push("/managerdashboard")
      }else{
        // Set current user
        dispatch(setCurrentUser(decoded));
        dispatch(setWho(userType));
        console.log("prosumer loggin succuess");
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

export const setWho = userType => {
  return {
    type: CURRENT_TYPE,
    payload: userType
  };
};

// Log user out, maybe a redirect?
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch(setCurrentManager({}));
};