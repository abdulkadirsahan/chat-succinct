/**
 * Succinct Labs - SP1 zkVM Intelligence Hub
 * Express server with Twitter integration
 */

const express = require('express');
const { Scraper } = require('agent-twitter-client');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Twitter credentials - IMPORTANT: Replace with your own or use environment variables
const TWITTER_CREDS = {
    username: process.env.TWITTER_USERNAME || '',
    password: process.env.TWITTER_PASSWORD || ''
};

// Initialize Twitter scraper
const scraper = new Scraper();
let isAuthenticated = false;

// Cache mechanism
const CACHE_FILE = path.join(__dirname, 'tweet_cache.json');
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

/**
 * Initialize Twitter connection
 */
async function initTwitter() {
    try {
        console.log('Attempting to login to Twitter...');
        await scraper.login(TWITTER_CREDS.username, TWITTER_CREDS.password);
        isAuthenticated = true;
        console.log('Twitter login successful');
    } catch (error) {
        console.error('Twitter login failed:', error.message);
        isAuthenticated = false;
    }
}

/**
 * Cache tweets to file
 */
function cacheTweets(tweets) {
    try {
        const cacheData = {
            timestamp: Date.now(),
            tweets: tweets
        };
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
        console.log(`Cached ${tweets.length} tweets to ${CACHE_FILE}`);
    } catch (error) {
        console.error('Error caching tweets:', error.message);
    }
}

/**
 * Get cached tweets
 */
function getCachedTweets() {
    try {
        if (!fs.existsSync(CACHE_FILE)) {
            return null;
        }
        
        const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        const now = Date.now();
        
        // Check if cache is expired
        if (now - cacheData.timestamp > CACHE_EXPIRY) {
            console.log('Cache expired, need to fetch fresh tweets');
            return null;
        }
        
        console.log(`Using cached tweets from ${new Date(cacheData.timestamp).toLocaleString()}`);
        return cacheData.tweets;
    } catch (error) {
        console.error('Error reading tweet cache:', error.message);
        return null;
    }
}

// Initialize Twitter connection
initTwitter();

// Middleware
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tweets', async (req, res) => {
    // Check for cached tweets first
    const cachedTweets = getCachedTweets();
    if (cachedTweets) {
        return res.json(cachedTweets);
    }
    
    // No cache, try to fetch from Twitter
    try {
        if (!isAuthenticated) {
            // Try to reconnect
            await initTwitter();
            
            if (!isAuthenticated) {
                // Still not authenticated, return error
                throw new Error('Not authenticated with Twitter. Please check credentials.');
            }
        }
        
        console.log('Fetching tweets from Twitter...');
        const tweetGenerator = scraper.getTweets('SuccinctLabs', 15); // Get more tweets to filter non-replies
        const tweets = [];
        
        // Collect tweets from generator
        for await (const tweet of tweetGenerator) {
            tweets.push(tweet);
            
            // Stop after 15 tweets to prevent long loading times
            if (tweets.length >= 15) break;
        }
        
        if (!Array.isArray(tweets)) {
            throw new Error('Received data is not an array');
        }
        
        console.log(`Fetched ${tweets.length} tweets successfully`);
        
        // Cache tweets for future requests
        cacheTweets(tweets);
        
        res.json(tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error.message);
        
        // Try to use backup cached tweets even if expired
        try {
            if (fs.existsSync(CACHE_FILE)) {
                const fallbackCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
                console.log('Using expired cache as fallback');
                return res.json(fallbackCache.tweets);
            }
        } catch (cacheError) {
            console.error('Error reading fallback cache:', cacheError.message);
        }
        
        // If all else fails, return mock data
        return res.status(500).json([
            {
                id: 'mock1',
                text: 'Twitter integration is currently unavailable. Please try again later. In the meantime, you can learn about SP1 by asking questions to the chatbot.',
                time: new Date().toISOString(),
                favorites: 0,
                retweets: 0,
                replies: 0
            }
        ]);
    }
});

// Fallback route for all other requests
app.get('*', (req, res) => {
    res.redirect('/');
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        error: 'Server error',
        details: err.message
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Press Ctrl+C to stop the server`);
}); 
