# frontend
FROM node:18 AS frontend

WORKDIR /app/frontend

COPY frontend/package.json .
RUN npm install

COPY frontend/ .
RUN npm run build

# backend
FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

COPY --from=frontend /app/frontend/build ./frontend/build
COPY ./backend/ ./backend

EXPOSE 8085

CMD ["node", "./backend/server.js"]
