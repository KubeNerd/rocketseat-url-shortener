FROM node:20.11.1 as buildImageNode

WORKDIR /appBuild

COPY package-lock.json package.json tsconfig.json ./

COPY . ./

RUN npm install && \
    npm run build

FROM node:16.15.1-alpine

WORKDIR /app

COPY --from=buildImageNode appBuild/build /app

COPY . .

RUN npm install

EXPOSE 3333

ENTRYPOINT [ "npm", "start" ]