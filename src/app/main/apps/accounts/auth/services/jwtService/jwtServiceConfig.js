const jwtServiceConfig = {
  // User Table Endpoints

  signup: {
    apiname: "agroshubapi",
    path: "/user/create"
  },
  getuserbymobile: {
    apiname: "agroshubapi",
    path: "/user/getuserbymobileno"
  },
  getuserbyemail: {
    apiname: "agroshubapi",
    path: "/user/getuserbyemail"
  },
  getuserbyuuid: {
    apiname: "agroshubapi",
    path: "/user/getuserbyuuid"
  },
  getuserbyorganizationid: {
    apiname: 'agroshubapi',
    path: '/user/getuserbyorganizationid'
  },
  updateuserbyuuid: {
    apiname: "agroshubapi",
    path: "/user/updateuserbyuuid"
  },
}

export default jwtServiceConfig;
