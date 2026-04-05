# Dot ENV Config

- MISTAKE TO AVOID:
  - env variables get undefined due to dotenv not loaded properly
  - create email.service.ts file and console process.env.EMAIL (get undefined)
  - EVEN THOUGH imported dotenv in app.ts

# Typescript (2 ways to use it)

## 1way (compile ts and then run js)

- npx tsc --init (create tsconfig) and set outDir dist/ rootDir
- tsc && node dist/app.js

## 2way (no need to compile youself)

- use ts-node package
- nodemon --exec ts-node --esm src/app.ts (--esm for esmodule) (explicitly tell nodemon to use ts-node)
- nodemon --esm src/app.ts (nodemon internally use ts-node)
- use tsconfig to allow .ts imports

# Winston logger

- log full error objects when the logger's top-level format includes errors({ stack: true })

# ES module

- In ES module `__dirname` and `__filename` do NOT exist

# MongoDB

- schema if field is unique but not required (e.g Phone)
  - cause duplicate error of null value
  - e.g phone -> no 2 record can be inserted with null value
  - to solve -> sparse:true it will ignore field with null or undefined values
  - IMP: update new sparse:true index by deleting old index in mongodb compass

# User Auth Module

## Signup

- Attacker can attack by sending random emails which get store in our db
- before creating user, verify user email by sending 'verify link' in their email
- verify link is our api '/api/verify/:token'
- user signup -> store data in 'tempUser collection' not in real 'user collection'
- generate jwt token with user_id and set expire of 1hr
- if verified push data in real collection and delete data from 'tempUser collection'
- else user not click on verify link within 1 hr
- then, auto delete that user from 'tempUser collection'

- Attack can flood 'tempUser collection' so add rate limiting
