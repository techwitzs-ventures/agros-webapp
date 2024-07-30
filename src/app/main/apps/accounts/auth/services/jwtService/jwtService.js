import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import { Amplify, Auth } from "aws-amplify";
import awsconfig from "../../../../../../../aws-exports";

Amplify.configure(awsconfig);

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  token = ""

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");
      return;
    }
    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  createTenant = (data) => {
    return new Promise((resolve, reject) => {
      axios.post('/onboarding', data).then((response) => {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          console.log(response)
          reject("Error in 'creating user'!")
        }
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  };

  // User Table Enpoints

  // Fetching user's details from the user dynamodb or table
  getSingleUserDetailsByUUID = async (data) => {
    return new Promise((resolve, reject) => {
      axios.get('/user/getuserbyuuid', {
        params: data
      }).then((res) => {
        if (res.status === 200) {
          resolve(res.data.response)
        } else {
          console.log(res)
          reject(res.data.response)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  };

  // Fetching User Details by Tenant Id
  getUserByTenantId = (tenant_id) => {
    return new Promise((resolve, reject) => {
      axios.get('/user/getuserbytenantid', {
        params: { tenant_id }
      }).then((res) => {
        if (res.status === 200) {
          resolve(res.data.response)
        } else {
          console.log(res.data.response)
          reject(res.data.response)
        }
      }).catch((error) => {
        console.log(error)
        reject(error);
      })
    })
  }

  // Fetching User Details by Tenant Mobile Number
  getUserByMobileNumber = (mobilenumber) => {
    return new Promise((resolve, reject) => {
      axios.get('/tenant/getuserbymobile', {
        params: {
          mobilenumber
        }
      }).then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          console.log(res.data);
          reject(res.data)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  // Checking User Email Verification Status
  getEmailVerificationStatus = (mobilenumber) => {
    return new Promise((resolve, reject) => {
      axios.get('/tenant/emailverificationstatus', {
        params: {
          mobilenumber
        }
      }).then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          console.log(res.data);
          reject(res.data)
        }
      }).catch((error) => {
        console.log(error);
        reject(error)
      })
    })
  }

  // User Table API to update the user's credentials
  updateUserCredentialByUUID = async (data, tenant_id) => {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then(async (response) => {

          if (response) {

            const result = await axios.patch('/user/updateuserbyuuid', data, {
              params: {
                uuid: response.signInUserSession.accessToken.payload.sub,
                tenant_id
              }
            })

            if (result.status === 200) {
              this.emit("onUpdate", result.data.response);
              resolve(result);
            } else {
              console.log(result);
              reject(new Error("Failed to update user"));
            }
          } else {
            this.logout();
            reject(new Error("Failed to login with Jwt Authentication Token"));
          }

        })
        .catch((err) => {
          this.logout();
          reject(new Error("Failed to login with Jwt Authentication Token"));
        });
    });
  };

  // Get Cognito User Details Endpoints
  getCognitoUserCredentials = async (mobilenumber) => {
    return new Promise((resolve, reject) => {
      axios.get("/auth/getcognitouser", { params: { mobilenumber } }).then((result) => {
        if (result.status === 200) {
          if (result.data.success) {
            resolve(result.data)
          } else {
            reject(result)
          }
        } else {
          reject(result)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  // update Mobile Number Verification Status
  updateMobileNumberVerificationStatus = (data) => {
    return new Promise((resolve, reject) => {
      axios.put('/auth/verificationstatus/mob/update', data).then((response) => {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  // update Email Verification Status
  updateEmailVerificationStatus = (data) => {
    return new Promise((resolve, reject) => {
      axios.put('/auth/verificationstatus/email/update', data).then((response) => {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  // update Onboarding Status
  updateOnboardingStatus = (data) => {
    return new Promise((resolve, reject) => {
      axios.put('/auth/onboardingstatus/update', data).then((response) => {
        if (response.status === 200) {
          this.emit("onCompleteOnboard", true);
          resolve(response.data)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  // Generate and send Mobile Otp through SNS
  sendOtpToMobileNumber = (mobilenumber) => {
    return new Promise((resolve, reject) => {
      axios.post('/auth/sendotp/mobile', { mobilenumber }).then((result) => {
        if (result.status === 200) {
          this.token = result.data.response.otp_token
          resolve(result.data)
        } else {
          console.log(result)
          reject(result)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  };

  // Verify OTP through API Gateway and jwtToken
  verifyMobileNumberOtp = async (username, otp_answer) => {
    return new Promise((resolve, reject) => {
      axios.post('/auth/verifyotp', { otp_token: this.token, otp_answer }).then((result) => {

        this.token = null

        if (result.status === 200) {

          if (result.data.success) {

            this.updateMobileNumberVerificationStatus({ username, newStatus: true }).then((res) => {

              if (res.success) {
                this.emit("onVerifyMobileNumber", true)
                resolve(result.data)
              } else {
                console.log(res)
                reject(res)
              }

            }).catch((error) => {

              console.log(error)
              reject(error)

            })

          } else {

            resolve(result.data)

          }

        } else {
          console.log(result);
          reject(result)
        }
      }).catch((error) => {
        console.log(error);
        reject(error)
      })
    })
  };

  // Generate and send Email Otp through SNS
  sendOtpToEmail = (email) => {
    return new Promise((resolve, reject) => {
      axios.post('/auth/sendotp/email', { email }).then((result) => {
        if (result.status === 200) {
          this.token = result.data.response.otp_token
          resolve(result.data)
        } else {
          console.log(result)
          reject(result)
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  // Verify OTP through API GAteway and jwtToken
  verifyEmailOtp = async (username, otp_answer) => {

    return new Promise((resolve, reject) => {
      axios.post('/auth/verifyotp', { otp_token: this.token, otp_answer }).then((result) => {

        this.token = null

        if (result.status === 200) {

          if (result.data.success) {

            this.updateEmailVerificationStatus({ username, newStatus: true }).then((res) => {

              if (res.success) {
                this.emit("onVerifyEmail", true)
                resolve(result.data)
              } else {
                console.log(res)
                reject(res)
              }

            }).catch((error) => {

              console.log(error)
              reject(error)

            })

          } else {

            resolve(result.data)

          }

        } else {
          console.log(result);
          reject(result)
        }
      }).catch((error) => {
        console.log(error);
        reject(error)
      })
    })
  }

  /* ---------------
     Cognito Endpoints Start
     ---------------
     */

  // Verifying the logged in user session by getting the token from local storage
  verifyAuth = () => {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then(async (response) => {
          if (response) {

            const cognitouser = await this.getCognitoUserCredentials(response.attributes.phone_number);

            const mobstatus = cognitouser.response.UserAttributes.find(item => item.Name === 'phone_number_verified').Value === 'true'
            const emailstatus = cognitouser.response.UserAttributes.find(item => item.Name === 'email_verified').Value === 'true'
            const onboardingstatus = cognitouser.response.UserAttributes.find(item => item.Name === 'custom:onboarding').Value === 'true'

            this.emit("onVerifyMobileNumber", mobstatus);
            this.emit("onVerifyEmail", emailstatus);
            this.emit("onCompleteOnboard", onboardingstatus);

            const user = await this.getSingleUserDetailsByUUID({
              uuid: response.signInUserSession.accessToken.payload.sub,
            });

            this.setSession(response.signInUserSession.accessToken.jwtToken);
            resolve(user);

          } else {

            this.logout();
            reject(new Error("Failed to login with Jwt Authentication Token"));

          }
        })
        .catch((err) => {

          this.logout();
          reject(new Error("Failed to login with Jwt Authentication Token"));

        });
    });
  };

  // Sign In with username and password
  signInWithEmailPassword = async (username, password) => {

    try {
      const result = await Auth.signIn({ username, password });

      if (result.signInUserSession !== null) {

        const cognitouser = await this.getCognitoUserCredentials(result.attributes.phone_number);

        const mobstatus = cognitouser.response.UserAttributes.find(item => item.Name === 'phone_number_verified').Value === 'true'
        const emailstatus = cognitouser.response.UserAttributes.find(item => item.Name === 'email_verified').Value === 'true'
        const onboardingstatus = cognitouser.response.UserAttributes.find(item => item.Name === 'custom:onboarding').Value === 'true'

        this.emit("onVerifyMobileNumber", mobstatus);
        this.emit("onVerifyEmail", emailstatus);
        this.emit("onCompleteOnboard", onboardingstatus);

        const user = await this.getSingleUserDetailsByUUID({
          uuid: result.signInUserSession.accessToken.payload.sub
        });

        this.setSession(result.signInUserSession.accessToken.jwtToken);
        this.emit("onLogin", user);

        return { code: 1, status: true };

      } else {

        console.log(result)

      }

    } catch (e) {

      if (e.code === "UserNotFoundException") {
        return { code: 0, status: false };
      } else if (e.code === "UsernameExistsException") {
        this.signInWithEmailPassword(username, password);
      } else if (e.code === "NotAuthorizedException") {
        return { code: 2, status: false };
      } else {
        console.log(e.message);
        return { code: 3, status: false };
      }

    }
  };

  // Logout User
  logout = () => {
    Auth.signOut();
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  // Send Email OTP for reset password
  sendEmailOTPForResetPassword = async (mobilenumber) => {
    return new Promise((resolve, reject) => {

      Auth.forgotPassword(mobilenumber).then((response) => {
        resolve(response);
      }).catch((error) => {
        reject(new Error(error.message));
      });

    });
  };

  // Verification of the code to reset the password
  resetPasswordSumbit = async (mobilenumber, code, newpassword) => {
    return new Promise((resolve, reject) => {

      Auth.forgotPasswordSubmit(mobilenumber, code, newpassword).then((response) => {
        resolve(response);
      }).catch((error) => {
        if (error.code === "CodeMismatchException") {
          resolve(error.code);
        } else {
          reject(new Error(error));
        }
      });

    });
  };

  // Give old password and new password to change the password
  changePassword = async (oldpass, newpass) => {
    console.log(oldpass, newpass);
    Auth.currentAuthenticatedUser()
      .then((response) => {
        Auth.changePassword(response, oldpass, newpass)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            if (e.code === "NotAuthorizedException") {
              console.log("Incorrect User Name Password");
            } else if (e.code === "InvalidPasswordException") {
              console.log("Password is too short");
            } else if (e.code === "LimitExceededException") {
              console.log(e.message);
            } else {
              console.log(e);
            }
          });
      })
      .catch((error) => {
        new Error(error);
      });
  };

  // Checking the user is authenticated or not
  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    return true;
  };

  // Setting Access Token
  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  // Getting Access Token
  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
