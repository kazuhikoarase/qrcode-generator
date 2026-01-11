import { dot2svg } from "https://code4fukui.github.io/dot2svg/dot2svg.js";

const addMargin = (data, marginw) => {
  const spcline = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < marginw; j++) {
      data[i].unshift(0);
      data[i].push(0);
    }
  }
  for (let i = 0; i < data[0].length; i++) {
    spcline.push(0);
  }
  for (let i = 0; i < marginw; i++) {
    data.unshift(spcline);
    data.push(spcline);
  }
};

export const qrdata2svg = (data, dotw) => {
  const marginw = 4;
  addMargin(data, marginw);

  const dot = data.map(i => i.join("")).join("\n");
  const svg = dot2svg(dot, dotw);
  const svg2 = `<svg version="1.1" width="${data[0].length * dotw}" height="${data[0].length * dotw}" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
  return svg2;
};
