// CSS modules
type CSSModuleClasses = Readonly<Record<string, string>>;

declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
}
