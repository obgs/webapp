import { GroupMembershipRole } from "../../../graphql/generated";

const roles: Record<GroupMembershipRole, string> = {
  [GroupMembershipRole.Admin]: "Admin",
  [GroupMembershipRole.Member]: "Member",
  [GroupMembershipRole.Owner]: "Owner",
};

export default roles;
