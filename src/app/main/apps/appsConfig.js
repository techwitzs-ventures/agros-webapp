import CompleteOnboardingConfig from './completeOnboarding/completeOnboardingConfig';
import CustomersAppConfig from './customers/customersAppConfig';
import ECommerceAppConfig from './inventory/ECommerceAppConfig';
import invoiceConfig from './invoice/invoiceConfig';
import orderConfig from './order/orderConfig';
import ProfileAppConfig from './profile/profileAppConfig';
import UsersAppConfig from './users/usersAppConfig';
import VendorsAppConfig from './vendors/vendorsAppConfig';

const appsConfigs = [
  ProfileAppConfig,
  ECommerceAppConfig,
  CustomersAppConfig,
  VendorsAppConfig,
  UsersAppConfig,
  orderConfig,
  invoiceConfig,
  CompleteOnboardingConfig,
];

export default appsConfigs;
