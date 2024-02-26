import { Partner, User } from '@prisma/client';

export type PartnerOrUser = {
  partner?: Pick<Partner, 'id'>;
  user?: Pick<User, 'id'>;
};
