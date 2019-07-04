import normalize from "./normalize";
export { default as normalize } from "./normalize";

export const colors = {
  primary: "#108ee9",
  drawerActive: "#2eb1fc",
  primaryFaded: "#108ee991",
  disabled: "#cacaca",
  success: "#87d068",
  error: "#ff5500",
  background: "#e9e9ef", // deprecated?
  backgroundColor: "#d8dce0",
  borderColor: "#d6d7da",
  lines: "#ced0ce",
  yellow: "#ffd478",
  iosBlue: "#037aff",
  screenBackground: "#ececec",
  clear: "transparent"
};

export const dimensions = {
  paddingHorizontal: normalize(20),
  drawerIconSize: normalize(19.2),
  navHeaderHeight: 44,
  modalWidth: 315
};
