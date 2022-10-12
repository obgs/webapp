export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Node: [
      "Player",
      "PlayerSupervisionRequest",
      "PlayerSupervisionRequestApproval",
      "User",
    ],
  },
};
export default result;
