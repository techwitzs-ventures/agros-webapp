/**
 * Authorization Roles
 */
const authRoles = {
  plateformadmin: ['plateformadmin'],
  plateformseller: ['plateformseller'],
  buyer: ['buyer'],
  forall: ['plateformadmin', 'plateformseller', 'buyer'],
  onlyPlateformAdminAndSeller: ['plateformadmin', 'plateformseller'],
  onlyPlateformAdminAndBuyer: ['plateformadmin', 'buyer'],
  onlyGuest: [],
};

export default authRoles;
