import normalize from "./normalize";
export { default as normalize } from "./normalize";

const iosBackground = "#efeff4";
export const colors = {
  primary: "#108ee9",
  drawerActive: "#2eb1fc",
  primaryFaded: "#108ee991",
  disabled: "#cacaca",
  success: "#87d068",
  error: "#ff5500",
  background: iosBackground,
  backgroundColor: iosBackground,
  borderColor: "#d6d7da",
  lines: "#e3e3e5",
  yellow: "#ffd478",
  iosBlue: "#037aff",
  screenBackground: "#ececec",
  sectionHeader: "#8e8e8e",
  clear: "transparent"
};

export const dimensions = {
  paddingHorizontal: normalize(20),
  drawerIconSize: normalize(19.2),
  navHeaderHeight: 44,
  modalWidth: 315
};
