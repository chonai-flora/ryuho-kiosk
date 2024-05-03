FROM node:latest

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

WORKDIR /frontend/

COPY . /frontend/
COPY package.json /frontend
COPY package-lock.json /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
RUN npm install
# RUN npm install react-scripts

EXPOSE 5173
CMD ["npm", "run", "dev"]