# Typescript (2 ways to use it)

## 1way (compile ts and then run js)

- npx tsc --init (create tsconfig) and set outDir dist/ rootDir
- tsc && node dist/app.js

## 2way (no need to compile youself)

- use ts-node package
- nodemon --exec ts-node --esm src/app.ts (--esm for esmodule) (explicitly tell nodemon to use ts-node)
- nodemon --esm src/app.ts (nodemon internally use ts-node)
- use tsconfig to allow .ts imports
