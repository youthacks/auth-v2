// Browser logos from https://github.com/alrra/browser-logos, licence MIT

import brave from "#/assets/images/browsers/brave_24x24.png";
import chrome from "#/assets/images/browsers/chrome_24x24.png";
import chromium from "#/assets/images/browsers/chromium_24x24.png";
import edge from "#/assets/images/browsers/edge_24x24.png";
import firefox from "#/assets/images/browsers/firefox_24x24.png";
import opera from "#/assets/images/browsers/opera_24x24.png";
import operaGx from "#/assets/images/browsers/opera-gx_24x24.png";
import safari from "#/assets/images/browsers/safari_24x24.png";
import samsungInternet from "#/assets/images/browsers/samsung-internet_24x24.png";
import vivaldi from "#/assets/images/browsers/vivaldi_24x24.png";

export const browsers = [
  {
    name: "Brave",
    src: brave,
    regex: /^Brave/i,
  },
  {
    name: "Chrome",
    src: chrome,
    regex: /^Chrome/i,
  },
  {
    name: "Chromium",
    src: chromium,
    regex: /^Chromium/i,
  },
  {
    name: "Edge",
    src: edge,
    regex: /^Edge/i,
  },
  {
    name: "Firefox",
    src: firefox,
    regex: /^Firefox/i,
  },
  {
    name: "Opera",
    src: opera,
    regex: /^Opera(?!\sGX)/i,
  },
  {
    name: "Opera GX",
    src: operaGx,
    regex: /^Opera\sGX/i,
  },
  {
    name: "Safari",
    src: safari,
    regex: /^Safari/i,
  },
  {
    name: "Samsung Internet",
    src: samsungInternet,
    regex: /^Samsung\sInternet/i,
  },
  {
    name: "Vivaldi",
    src: vivaldi,
    regex: /^Vivaldi/i,
  },
];
