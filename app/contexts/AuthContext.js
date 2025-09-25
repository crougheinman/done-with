import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../services/authService";
import User from "../models/User";

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  RESTORE_SESSION: "RESTORE_SESSION",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  SET_LOADING: "SET_LOADING",
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isLoading: true, // Start with loading true for session restoration
  isAuthenticated: false,
  error: null,
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false, // Ensure loading is false after logout
      };
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: !!action.payload.token,
        user: action.payload.user,
        token: action.payload.token,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app start
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        const user = User.fromFirestore(parsedUserData, parsedUserData.id);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: { token, user },
        });
      }
    } catch (error) {
      console.error("Error restoring session:", error);
    } finally {
      // Always set loading to false after session restoration attempt
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        // Generate a simple token (in production, this would come from your backend)
        const token = `token_${Date.now()}_${result.user.id}`;

        // Create User instance from the result
        const user = User.fromFirestore(result.user, result.user.id);

        // Store in AsyncStorage
        await AsyncStorage.setItem("auth_token", token);
        await AsyncStorage.setItem("user_data", JSON.stringify(result.user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: result.error,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user_data");
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      // Update the user in state
      const updatedUser = User.fromFirestore(
        updatedUserData,
        updatedUserData.id
      );
      dispatch({
        type: AUTH_ACTIONS.RESTORE_SESSION,
        payload: { token: state.token, user: updatedUser },
      });

      // Update AsyncStorage
      await AsyncStorage.setItem("user_data", JSON.stringify(updatedUserData));

      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
