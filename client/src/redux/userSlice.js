import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {
          id: "",
          name: "",
          email: "",
          image: "",
          isAdmin: false,
          token: "",
          tokenExpiration: null,
        },

    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state, action) => {
      state.user.id = "";
      state.user.name = "";
      state.user.email = "";
      state.user.image = "";
      state.user.isAdmin = false;
      state.user.token = "";
      state.user.tokenExpiration = null;
      state.status = "idle"; // so login button becomes clickable again
      localStorage.removeItem("user");
    },
    // Sets state.status to 'idle' again so login button becomes clickable again
    clearError: (state, action) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.credentialLogin.matchFulfilled,
        (state, action) => {
          state.user.id = action.payload.id;
          state.user.name = action.payload.name;
          state.user.email = action.payload.email;
          state.user.image = action.payload.image;
          state.user.isAdmin = action.payload.isAdmin;
          state.user.token = action.payload.token;
          // First, response data gets assigned to state...
          state.user.tokenExpiration = action.payload.expiration;

          localStorage.setItem(
            "user",
            JSON.stringify({
              id: action.payload.id,
              name: action.payload.name,
              email: action.payload.email,
              image: action.payload.image,
              isAdmin: action.payload.isAdmin,
              token: action.payload.token,
              // Then, state gets assigned to Local Storage...
              // I write it this way instead of simply spreading, so I know in the future
              // Why I did what I did
              tokenExpiration: state.user.tokenExpiration.toString(),
            })
          );
        }
      )
      .addMatcher(
        // THIS addMATCHER IS HERE TO ENSURE CUSTOM MESSAGES GET
        // INJECTED INTO DIALOG MODAL!!!
        // OTHERWISE RTK error will kick in and SINCE I AM DOING
        // A HYBRID DATA TRANSFER IN THIS VERY PARTICULAR CASE, THATS HOW I NEED IT
        // IF (WHEN) I USE A DEDICATED ERROR PAGE, I'LL SWITCH BACK TO RTK ERROR OBJECT
        apiSlice.endpoints.credentialLogin.matchRejected,
        (state, action) => {
          console.log("action.payload credentialLogin"); //test
          console.log(action.payload); //test  ALLOWS CUSTOM MESSAGING
          state.error = action.payload.data.message; // CUSTOM
        }
      )
      .addMatcher(
        apiSlice.endpoints.googleLogin.matchFulfilled,
        (state, action) => {
          state.user.id = action.payload.id;
          state.user.name = action.payload.name;
          state.user.email = action.payload.email;
          state.user.image = action.payload.image;
          state.user.isAdmin = action.payload.isAdmin;
          state.user.token = action.payload.token;
          state.user.tokenExpiration = action.payload.expiration;

          localStorage.setItem(
            "user",
            JSON.stringify({
              id: action.payload.id,
              name: action.payload.name,
              email: action.payload.email,
              image: action.payload.image,
              isAdmin: action.payload.isAdmin,
              token: action.payload.token,
              tokenExpiration: state.user.tokenExpiration.toString(),
            })
          );
        }
      )
      .addMatcher(
        apiSlice.endpoints.googleLogin.matchRejected,
        (state, action) => {
          state.error = action.payload.data.message; // CUSTOM
        }
      )
      .addMatcher(
        apiSlice.endpoints.credentialRegister.matchFulfilled,
        (state, action) => {
          state.user.id = action.payload.id;
          state.user.name = action.payload.name;
          state.user.email = action.payload.email;
          state.user.image = action.payload.image;
          state.user.isAdmin = action.payload.isAdmin;
          state.user.token = action.payload.token;
          state.user.tokenExpiration = action.payload.expiration;
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: action.payload.id,
              name: action.payload.name,
              email: action.payload.email,
              image: action.payload.image,
              isAdmin: action.payload.isAdmin,
              token: action.payload.token,
              tokenExpiration: state.user.tokenExpiration.toString(),
            })
          );
        }
      )
      .addMatcher(
        apiSlice.endpoints.credentialRegister.matchRejected,
        (state, action) => {
          state.error = action.payload.data.message; // CUSTOM
        }
      )
      .addMatcher(
        apiSlice.endpoints.googleRegister.matchFulfilled,
        (state, action) => {
          state.user.id = action.payload.id;
          state.user.name = action.payload.name;
          state.user.email = action.payload.email;
          state.user.image = action.payload.image;
          state.user.isAdmin = action.payload.isAdmin;
          state.user.token = action.payload.token;
          state.user.tokenExpiration = action.payload.expiration;

          localStorage.setItem(
            "user",
            JSON.stringify({
              id: action.payload.id,
              name: action.payload.name,
              email: action.payload.email,
              image: action.payload.image,
              isAdmin: action.payload.isAdmin,
              token: action.payload.token,
              tokenExpiration: state.user.tokenExpiration.toString(),
            })
          );
        }
      )
      .addMatcher(
        apiSlice.endpoints.googleRegister.matchRejected,
        (state, action) => {
          state.error = action.payload.data.message; // CUSTOM
        }
      );
  },
});

// Exports reducer functions
export const { clearError, logout, autoLogin } = userSlice.actions;

// Exports individual selectors
export const selectUserName = (state) => state.user.user.name;
export const selectUserId = (state) => state.user.user.id;
export const selectUserImage = (state) => state.user.user.image;
export const selectUserAdmin = (state) => state.user.user.isAdmin;
export const selectToken = (state) => state.user.user.token;
export const selectTokenExpiration = (state) => state.user.user.tokenExpiration;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
