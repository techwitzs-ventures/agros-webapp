import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "../../../../../../../aws-exports";
import jwtServiceConfig from "./jwtServiceConfig";

Amplify.configure(awsconfig);

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  sessionvariable = ""

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

  // User Table Enpoints

  // Fetching user's details from the user dynamodb or table
  getSingleUserDetailsByUUID = async (data) => {
    try {
      return await API.post(
        jwtServiceConfig.getuserbyuuid.apiname,
        jwtServiceConfig.getuserbyuuid.path,
        data
      );
    } catch (error) {
      console.log(error);
    }
  };

  // User Table API to update the user's credentials
  updateUserCredentialByUUID = async (data, tenant_id) => {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then(async (response) => {
          if (response) {
            const result = await API.patch(
              jwtServiceConfig.updateuserbyuuid.apiname,
              `${jwtServiceConfig.updateuserbyuuid.path}/?uuid=${response.signInUserSession.accessToken.payload.sub}&tenant_id=${tenant_id}`,
              data
            );
            this.emit("onUpdate", result.response);
            resolve(result);
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

  // update Mobile Number Verification Status
  updateMobileNumberVerificationStatus = (data) => {
    return new Promise((resolve, reject) => {
      axios.put('/auth/updatemobilenumberverificationstatus', data).then((response) => {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }

  // Cognito Authentication Endpoints

  // Verifying the logged in user session by getting the token from local storage
  verifyAuth = () => {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then(async (response) => {
          if (response) {

            const { attributes } = response

            this.emit("onVerifyMobileNumber", attributes.phone_number_verified);
            this.emit("onVerifyEmail", attributes.email_verified);
            this.emit("onCompleteOnboard", attributes["custom:onboarding"]);

            const user = await this.getSingleUserDetailsByUUID({
              body: {
                uuid: response.signInUserSession.accessToken.payload.sub,
              },
            });

            this.setSession(response.signInUserSession.accessToken.jwtToken);
            resolve(user.response);

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

        const { attributes } = result

        this.emit("onVerifyMobileNumber", attributes.phone_number_verified);
        this.emit("onVerifyEmail", attributes.email_verified);
        this.emit("onCompleteOnboard", attributes["custom:onboarding"]);

        const user = await this.getSingleUserDetailsByUUID({
          body: { uuid: result.signInUserSession.accessToken.payload.sub },
        });

        this.setSession(result.signInUserSession.accessToken.jwtToken);
        this.emit("onLogin", user.response);

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

  // Generate and send OTP through Cognito
  generateOtp = async (request) => {
    
  };

  // Verify OTP through Cognito
  verifyOtp = async (otp) => {
    console.log(otp)
    return true
    
  };

  // Logout User
  logout = () => {
    Auth.signOut();
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  // Send Email OTP for reset password
  sendEmailOTPForResetPassword = async () => {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((response) => {
          const { attributes } = response;
          Auth.forgotPassword(attributes.phone_number)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(new Error(error.message));
            });
        })
        .catch(() => {
          this.logout();
          reject(new Error("Failed to login with Jwt Authentication Token"));
        });
    });
  };

  // Verification of the code to reset the password
  resetPasswordSumbit = async (code, newpassword) => {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((response) => {
          if (response) {
            const { attributes } = response;
            Auth.forgotPasswordSubmit(
              attributes.phone_number,
              code,
              newpassword
            )
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                if (error.code === "CodeMismatchException") {
                  resolve(error.code);
                } else {
                  reject(new Error(error));
                }
              });
          } else {
            this.logout();
            reject(new Error("Failed to login with Jwt Authentication Token"));
          }
        })
        .catch(() => {
          this.logout();
          reject(new Error("Failed to login with Jwt Authentication Token"));
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
