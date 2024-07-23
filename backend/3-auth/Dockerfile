FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./
RUN npm ci --production
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]

# docker image build -t rulerchen/loginhub-1-gateway .
# docker tag rulerchen/loginhub-1-gateway rulerchen/loginhub-1-gateway:stable
# docker push rulerchen/loginhub-1-gateway:stable

