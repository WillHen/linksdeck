// Allow side-effect imports of global stylesheets (e.g. `import './globals.css'`).
// TypeScript 6 type-checks side-effect imports (TS2882) and needs an ambient
// module declaration for non-code assets that the bundler handles at build time.
declare module '*.css';
