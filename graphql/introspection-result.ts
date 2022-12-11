export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Node: [
      "Game",
      "Group",
      "GroupMembership",
      "GroupMembershipApplication",
      "GroupSettings",
      "Player",
      "PlayerSupervisionRequest",
      "PlayerSupervisionRequestApproval",
      "StatDescription",
      "User",
    ],
  },
};
export default result;
