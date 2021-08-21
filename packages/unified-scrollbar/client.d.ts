// CSS modules
type CSSModuleClasses = { readonly [key: string]: string };

declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
}
