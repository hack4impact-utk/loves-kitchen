const theme = {
  offWhite: '#fcf4e4',
  offWhiteRGBA: (percent: number) =>
    `rgba(252, 244, 228, .${percent.toFixed(0)})`, //rgb(252, 244, 228)
  darkCyan: '#055c5b',
  darkCyanRGBA: (percent: number) => `rgba(5,92,91, .${percent.toFixed(0)})`,
  brown: '#724b40',
  brownRGBA: (percent: number) => `rgba(114, 75, 64, .${percent.toFixed(0)})`,
  red: 'f30b27',
  redrgba: (percent: number) => `rgba(243, 11, 39, ${percent.toFixed(0)}%)`,
};
export default theme;
