import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../../enums/valid-roles.enum';

export const META_ROLES = 'roles';

// Adjunta los roles permitidos a un handler para validarlos en guards.
export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
