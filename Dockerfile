FROM node:22-alpine AS builder
ARG ENV=dev

WORKDIR /app

COPY package.json ./

RUN npm install 

COPY . .

RUN npm run build:${ENV}

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

RUN npm install
ENV PORT=80
EXPOSE 80

CMD ["npm", "run", "start"]
