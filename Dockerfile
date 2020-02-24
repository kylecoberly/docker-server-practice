FROM node:12
COPY . /app
WORKDIR /app
RUN npm ci
CMD npm start
