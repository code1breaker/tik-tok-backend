# Typescript (2 ways to use it)

## 1way (compile ts and then run js)

- npx tsc --init (create tsconfig) and set outDir dist/ rootDir
- tsc && node dist/app.js

## 2way (no need to compile youself)

- use ts-node package
- nodemon --exec ts-node --esm src/app.ts (--esm for esmodule) (explicitly tell nodemon to use ts-node)
- nodemon --esm src/app.ts (nodemon internally use ts-node)
- use tsconfig to allow .ts imports

# MongoDB

- schema if field is unique but not required (e.g Phone)
  - cause duplicate error of null value
  - e.g phone -> no 2 record can be inserted with null value
  - to solve -> sparse:true it will ignore field with null or undefined values
  - IMP: update new sparse:true index by deleting old index in mongodb compass
