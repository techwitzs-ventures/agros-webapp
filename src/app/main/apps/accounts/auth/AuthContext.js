import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import jwtService from './services/jwtService';
import { getAllTenant } from 'app/store/tenantSlice';
import { getAllItems } from 'app/store/allItemsSlice';
import { getAllItemsCategories } from 'app/store/allItemsCategoriesSlice';
import { getAllPurchaseOrders } from 'app/store/allPurchaseOrdersSlice';
import { getAllSalesOrders } from 'app/store/allSalesOrdersSlice';
import { getAllInvoice } from 'app/store/allInvoicesSlice';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const [mobileNumberVerificationStatus, setMobileNumberVerificationStatus] = useState(false)
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(false)
  const [onboardingStatus, setOnboardingStatus] = useState(false)

  const dispatch = useDispatch();

  useEffect(() => {

    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in with JWT' }));
      /**
       * Sign in and retrieve user data with stored token
       */
      jwtService
        .verifyAuth()
        .then((user) => {
          success(user, 'Signed in with JWT');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    jwtService.on('onLogin', (user) => {
      success(user, 'Signed In');
    });

    jwtService.on('onUpdate', (user) => {
      success(user, 'Profile Updated Successfully');
    })

    jwtService.on('onLogout', () => {
      pass('Signed Out');
      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);
      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.on('onVerifyMobileNumber', (status) => {
      setMobileNumberVerificationStatus(status)
    })

    jwtService.on('onVerifyEmail', (status) => {
      setEmailVerificationStatus(status)
    })

    jwtService.on('onCompleteOnboard', (status) => {
      setOnboardingStatus(status)
    })

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([
        dispatch(setUser(user)),
        dispatch(getAllTenant()),
        dispatch(getAllItems()),
        dispatch(getAllItemsCategories()),
        `${user.role === "plateformadmin" && dispatch(getAllPurchaseOrders())}`,
        `${user.role === "plateformadmin" && dispatch(getAllSalesOrders())}`,
        `${user.role === "plateformadmin" && dispatch(getAllInvoice())}`,

        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }
      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
    
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{
      isAuthenticated,
      mobileNumberVerificationStatus,
      emailVerificationStatus,
      onboardingStatus
    }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
