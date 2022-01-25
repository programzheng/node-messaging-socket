FROM node:16.13.2-alpine

COPY . /workspace
WORKDIR /workspace
RUN npm install

EXPOSE 5000

CMD npm start