export const color = [
  "#02B2AF",
  "#72CCFF",
  "#DA00FF",
  "#9001CB",
  "#2E96FF",
  "#3B48E0",
];

export const getColor = (index: number): string => {
  return color[index % color.length];
};
