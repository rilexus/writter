FROM node:10

COPY dist dist
COPY public public
COPY package.json package.json

RUN npm install

EXPOSE 3000
CMD node dist/server