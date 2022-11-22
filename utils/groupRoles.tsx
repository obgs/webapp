import { GroupMembershipRole } from "../graphql/generated";

const groupRoles: Record<GroupMembershipRole, string> = {
  [GroupMembershipRole.Admin]: "Admin",
  [GroupMembershipRole.Member]: "Member",
  [GroupMembershipRole.Owner]: "Owner",
};

export default groupRoles;
