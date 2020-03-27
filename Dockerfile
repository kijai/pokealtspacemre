FROM node:10.16-alpine
WORKDIR /opt/mre

COPY package*.json ./
RUN ["npm", "install", "--unsafe-perm"]
ENV BASE_URL=https://altspacepoke.herokuapp.com
COPY tsconfig.json ./
COPY src ./src/
RUN ["npm", "run", "build-only"]

COPY public ./public/

EXPOSE 3901/tcp
CMD ["npm", "start"]
