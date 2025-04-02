# Succinct SP1 Intelligence Hub

<div align="center">
  <img src="https://testnet.succinct.xyz/images/succinct-icon-pink.svg" alt="Succinct Labs Logo" width="120">
  <h3>AI-Powered zkVM Intelligence Platform</h3>
</div>

## Overview

Succinct SP1 Intelligence Hub is an interactive platform that combines an AI-powered chatbot with real-time Twitter integration for the Succinct Labs ecosystem. The application provides information about SP1 zkVM, zero-knowledge proofs, and displays tweets from @SuccinctLabs.

## Features

- 🤖 **AI Chatbot**: Ask questions about SP1 zkVM, zero-knowledge proofs, and related topics
- 🐦 **Twitter Integration**: View and refresh @SuccinctLabs tweets in real-time
- 🔗 **Smart Linking**: All Twitter links, mentions, and hashtags are automatically converted to clickable links
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Installation

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd succinct-sp1-intelligence-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Twitter credentials:
   Edit the `server.js` file and update the `TWITTER_CREDS` object with your Twitter credentials, or set them as environment variables:
   ```javascript
   const TWITTER_CREDS = {
       username: process.env.TWITTER_USERNAME || 'your_username',
       password: process.env.TWITTER_PASSWORD || 'your_password'
   };
   ```

4. Start the application:
   ```bash
   npm start
   # or
   yarn start
   ```

5. For development with auto-restart:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### AI Chatbot

The AI chatbot can answer questions about:
- SP1 zkVM architecture and features
- How to install and use SP1
- Zero-knowledge proofs and their applications
- Succinct Labs ecosystem

Example questions:
- "What is SP1?"
- "How do I install SP1?"
- "What are the hardware requirements for SP1?"
- "Explain zero-knowledge proofs"
- "Show latest tweets from Succinct Labs"

### Twitter Integration

The Twitter feed displays recent tweets from @SuccinctLabs:
- Click the "Refresh" button to fetch the latest tweets
- All links, mentions, and hashtags in tweets are clickable
- Tweet engagement metrics (replies, retweets, likes) are displayed
- Relative timestamps show when tweets were posted

## Technical Details

### Architecture

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express
- **Twitter Integration**: agent-twitter-client for Twitter scraping
- **Caching**: File-based caching system for Twitter data

### Files

- `index.html` - Main application HTML
- `styles.css` - Styling and animations
- `client.js` - Frontend JavaScript logic
- `server.js` - Express server with Twitter integration
- `package.json` - Project dependencies
- `tweet_cache.json` - Cached Twitter data (generated on first run)

## Security Notes

- This application includes Twitter credentials in the server code
- For production use, always use environment variables instead of hardcoding credentials
- Consider implementing proper authentication for a production deployment

## License

MIT License

## Acknowledgments

- Succinct Labs for the SP1 zkVM and documentation
- All open-source libraries used in this project 