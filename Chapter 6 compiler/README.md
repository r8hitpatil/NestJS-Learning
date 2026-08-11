# Compilation with SWC

By default, NestJS uses the standard TypeScript compiler (`tsc`). As an application scales, `tsc` becomes a bottleneck because it performs single-threaded type-checking and code transpilation simultaneously.

To optimize build performance, we swap `tsc` for **SWC (Speedy Web Compiler)**—an extensible, Rust-based compiler capable of transpiling code up to 20x faster because it focuses entirely on transpilation and ignores type-checking.

# What is SWC ?

Speedy Web Compiler

SWC is an extensible Rust-based platform for the next generation of fast developer tools. It's used by tools like Next.js, Parcel, and Deno, as well as companies like Vercel, ByteDance, Tencent, Shopify, Trip.com, and more.

SWC can be used for both compilation and bundling. For compilation, it takes JavaScript / TypeScript files using modern JavaScript features and outputs valid code that is supported by all major browsers.

## Toolchain Updates
In this chapter, the toolchain was migrated to:
1. **Yarn** (Package Manager)
2. **SWC** (NestJS Builder)

> **Warning:** SWC bypasses type-checking to achieve its speed. If you write broken TypeScript types, SWC will still compile it successfully. You must rely on your IDE for type errors or run `tsc --noEmit` in your CI/CD pipelines to strictly validate types.

***package.json***
```json
{
  "scripts": {
    "build": "nest build -b swc",
    "start:dev": "nest start -b swc --watch"
  }
}
```

## Configuration (`.swcrc`)

Because SWC is a framework-agnostic tool, it has no native context about NestJS. The `.swcrc` file serves as the configuration bridge:

* **`syntax: typescript`**: Instructs the compiler to parse modern `.ts` syntax.
* **`decorators: true`**: Mandatory for NestJS dependency injection (`@Controller()`, `@Injectable()`) to function.
* **`sourceMaps: true`**: Maps compiled JavaScript runtime execution back to the original `.ts` files for accurate error stack traces.
* **`baseUrl: ./`**: Enables resolution of absolute module imports across the project workspace.

***.swcrc***
```json
{
  "$schema": "https://swc.rs/schema.json",
  "sourceMaps": true,
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "baseUrl": "./"
  },
  "minify": false
}
```