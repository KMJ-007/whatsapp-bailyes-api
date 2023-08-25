FROM node:slim

ENV NODE_ENV development

COPY . .

Run npm install

Run npm run build

CMD ["node","build/index.js"]

Expose 5000