module.exports = {
    reactStrictMode: true,
    env: {
        FIREB_API_KEY: process.env.FIREB_API_KEY,
        FIREB_AUTH_DOMAIN: process.env.FIREB_AUTH_DOMAIN,
        FIREB_PROJECT_ID: process.env.FIREB_PROJECT_ID,
        FIREB_STORAGE_BUCKET: process.env.FIREB_STORAGE_BUCKET,
        FIREB_MESSAGING_SENDER_ID: process.env.FIREB_MESSAGING_SENDER_ID,
        FIREB_APP_ID: process.env.FIREB_APP_ID,
    }
  }