FROM ghcr.io/puppeteer/puppeteer:23.10.0

WORKDIR /app

COPY package*.json ./

USER root
RUN chown -R pptruser:pptruser /app

USER pptruser

RUN npm install

# Copy the rest of the application code
COPY --chown=pptruser:pptruser . .

RUN npm run build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 1212

CMD ["npm", "start"]
