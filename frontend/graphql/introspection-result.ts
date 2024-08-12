export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Node: [
      "Game",
      "GameVersion",
      "Group",
      "GroupMembership",
      "GroupMembershipApplication",
      "GroupSettings",
      "Match",
      "Player",
      "PlayerSupervisionRequest",
      "PlayerSupervisionRequestApproval",
      "StatDescription",
      "Statistic",
      "User",
    ],
  },
};
export default result;
