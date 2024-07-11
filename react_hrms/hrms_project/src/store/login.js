// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';


import { login } from "../api/login";

// Action Creators
export const loginRequest = () => ({
    type: LOGIN_REQUEST,
});

export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

// Thunk for Login
export const loginUser = ({username, password, successCB, errorCB}) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const result = await login(username, password,successCB, errorCB);
        dispatch(loginSuccess(result));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};



// Initial State
const initialState = {
    user: null,
    loading: false,
    error: null,
};

// Reducer
const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default loginReducer;