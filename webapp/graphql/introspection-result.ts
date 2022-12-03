export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Node: [
      "Group",
      "GroupMembership",
      "GroupMembershipApplication",
      "GroupSettings",
      "Player",
      "PlayerSupervisionRequest",
      "PlayerSupervisionRequestApproval",
      "User",
    ],
  },
};
export default result;
