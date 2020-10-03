declare module "*.svg";
declare module "console" {
  export = typeof import("console");
}
