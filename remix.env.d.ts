/// <reference types="@remix-run/dev" />
/// <reference types="@cloudflare/workers-types" />

// Fix for JSX runtime error
declare module "react/jsx-runtime" {
  const jsx: any;
  const jsxs: any;
  const Fragment: any;
  export { jsx, jsxs, Fragment };
}

// Fix for missing JSX.IntrinsicElements interface
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
