export const host = `http://localhost:8080`;

export const socketURL =
  process.env.NODE_ENV === "production" ? undefined : host;

// user routes
export const registerUserRoute = `${host}/api/v1/auth/register-user`;
export const updateUserRoute = `${host}/api/v1/auth/update-user`;
export const profileImageRoute = `${host}/api/v1/auth/user/profile-image`;
export const loginRoute = `${host}/api/v1/auth/login`;
export const resetPasswordRoute = `${host}/api/v1/auth/reset-password`;
// query param: uid
export const getAllUsersRoute = `${host}/api/v1/auth/get-all-users`;
// takes search query parameter
export const searchUsersRoute = `${host}/api/v1/auth/search-users`;

// message routes
export const sendMsgRoute = `${host}/api/v1/messages/send-new`;

// takes two params sender and receiver id's
export const getReceivedMsgRoute = `${host}/api/v1/messages/get-received`;

// takes two params sender and receiver id's
export const getLatestMsgRoute = `${host}/api/v1/messages/get-latest-one`;
