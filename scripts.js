// Knowledge base for SP1-related queries
const knowledge = {
    "sp1": {
        "introduction": "SP1 is a high-performance STARK-based zkVM (zero-knowledge virtual machine) developed by Succinct. It allows developers to write provable programs in Rust and C++ with minimal overhead, enabling fast and efficient verification of computations.",
        "features": ["General-purpose prover for zkVM", "STARK-based proving system", "Native Rust & C++ support", "Minimal performance overhead", "Recursive proofs", "Fast proving times"],
        "why_use": "SP1 enables developers to write efficient verifiable programs using familiar languages like Rust, making complex zero-knowledge applications more accessible and performant. It's ideal for creating verifiable state transitions, proving computations, and building trustless applications.",
        "zkvm": "A zkVM (zero-knowledge virtual machine) is a system that executes programs and generates zero-knowledge proofs of their correct execution. SP1's zkVM allows developers to prove that computations were performed correctly without revealing the inputs, enabling privacy-preserving verification."
    }
};

// Mock Twitter feed data (replace with API or scraping in production)
const twitterFeedData = [
    {
        id: "1",
        name: "Succinct Labs",
        handle: "@SuccinctLabs",
        content: "🚀 Exciting news! We've just released SP1 v0.8.0 with significant performance improvements and new features. Check out our blog for the full details: <a href='https://succinct.xyz/blog/sp1-v080' target='_blank'>succinct.xyz/blog/sp1-v080</a>",
        date: "April 1, 2025",
        likes: 128,
        retweets: 42,
        replies: 17,
        hasMedia: false
    },
    {
        id: "2",
        name: "Succinct Labs",
        handle: "@SuccinctLabs",
        content: "📢 Join us for our upcoming webinar on 'Building Zero-Knowledge Applications with SP1' next Thursday at 11am PT. Registration link in bio!",
        date: "March 30, 2025",
        likes: 75,
        retweets: 23,
        replies: 8,
        hasMedia: true,
        mediaUrl: "https://via.placeholder.com/300x200"
    },
    {
        id: "3",
        name: "Succinct Labs",
        handle: "@SuccinctLabs",
        content: "We're thrilled to announce that SP1 now supports C++ in addition to Rust! This expands our zkVM compatibility to an even broader developer audience. Documentation available at <a href='https://succinct.xyz/docs/cpp' target='_blank'>succinct.xyz/docs/cpp</a>",
        date: "March 25, 2025",
        likes: 215,
        retweets: 97,
        replies: 34,
        hasMedia: false
    },
    {
        id: "4",
        name: "Succinct Labs",
        handle: "@SuccinctLabs",
        content: "Our team is growing! We're looking for talented engineers passionate about zero-knowledge proofs and STARKs to join our mission. Apply at <a href='https://succinct.xyz/careers' target='_blank'>succinct.xyz/careers</a>",
        date: "March 20, 2025",
        likes: 93,
        retweets: 31,
        replies: 12,
        hasMedia: false
    },
    {
        id: "5",
        name: "Succinct Labs",
        handle: "@SuccinctLabs",
        content: "🔍 Deep dive: How SP1's STARK-based proving system achieves both performance and security without compromises. Read our technical analysis: <a href='https://succinct.xyz/blog/stark-deep-dive' target='_blank'>succinct.xyz/blog/stark-deep-dive</a>",
        date: "March 15, 2025",
        likes: 167,
        retweets: 58,
        replies: 23,
        hasMedia: true,
        mediaUrl: "https://via.placeholder.com/300x200"
    }
];

// Extension communication
let extensionConnected = false;
let extensionPort = null;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

// Initialize the application
function initializeApp() {
    // Display welcome message
    const welcomeMessage = {
        sender: 'bot',
        content: "Hello! I'm Succinct CHAT, your AI assistant for all things Succinct. Ask me about SP1, or check out the latest updates from @SuccinctLabs on the right. 🚀 How can I assist you today?"
    };
    displayMessage(welcomeMessage);
    
    // Load Twitter feed
    fetchTwitterFeed();
    
    // Try to connect with extension
    checkExtensionConnection();
}

// Set up event listeners
function setupEventListeners() {
    // Listen for Enter key in the input field
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Setup modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Extension check button
    document.getElementById('extension-check').addEventListener('click', checkExtensionConnection);
}

// Function to fetch and display Twitter feed
function fetchTwitterFeed() {
    const twitterFeed = document.getElementById('twitter-feed');
    twitterFeed.innerHTML = '<div class="tweet"><div class="tweet-content">Loading tweets...</div></div>';

    // If extension is connected, try to get tweets from it
    if (extensionConnected) {
        extensionPort.postMessage({
            action: 'getTweets',
            account: 'SuccinctLabs'
        });
        
        // Extension will respond through the message listener
        return;
    }

    // Fallback to mock data if no extension
    setTimeout(() => {
        displayTweets(twitterFeedData);
    }, 1500);
}

// Display tweets in the UI
function displayTweets(tweets) {
    const twitterFeed = document.getElementById('twitter-feed');
    twitterFeed.innerHTML = '';
    
    if (!tweets || tweets.length === 0) {
        twitterFeed.innerHTML = '<div class="tweet"><div class="tweet-content">No tweets found. Try scraping or refreshing again.</div></div>';
        return;
    }
    
    tweets.forEach(tweet => {
        const tweetEl = document.createElement('div');
        tweetEl.className = 'tweet';
        tweetEl.dataset.tweetId = tweet.id;
        
        let tweetHTML = `
            <div class="tweet-header">
                <div class="profile-pic">S</div>
                <div class="tweet-user">
                    <div class="tweet-name">${tweet.name}</div>
                    <div class="tweet-handle">${tweet.handle}</div>
                </div>
            </div>
            <div class="tweet-content">${tweet.content}</div>
        `;
        
        if (tweet.hasMedia && tweet.mediaUrl) {
            tweetHTML += `
                <div class="tweet-media">
                    <img src="${tweet.mediaUrl}" alt="Tweet media">
                </div>
            `;
        }
        
        tweetHTML += `
            <div class="tweet-actions">
                <div class="tweet-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    ${tweet.replies}
                </div>
                <div class="tweet-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"></path>
                    </svg>
                    ${tweet.retweets}
                </div>
                <div class="tweet-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    ${tweet.likes}
                </div>
            </div>
            <div class="tweet-date">${tweet.date}</div>
            <button class="tweet-reply-btn" onclick="showAIReplySuggestions('${tweet.id}')">Get AI Reply Suggestions</button>
        `;
        
        tweetEl.innerHTML = tweetHTML;
        twitterFeed.appendChild(tweetEl);
    });
}

// Scrape Tweets from Twitter
function scrapeTweets() {
    if (extensionConnected) {
        // Show a message that we're attempting to scrape
        const twitterFeed = document.getElementById('twitter-feed');
        twitterFeed.innerHTML = '<div class="tweet"><div class="tweet-content">Attempting to scrape tweets via the Chrome extension...</div></div>';
        
        // Request the extension to scrape tweets
        extensionPort.postMessage({
            action: 'scrapeTweets',
            account: 'SuccinctLabs',
            count: 10
        });
    } else {
        // Show extension modal if not connected
        document.getElementById('extension-modal').style.display = 'block';
    }
}

// Show AI reply suggestions for a tweet
function showAIReplySuggestions(tweetId) {
    const tweet = findTweetById(tweetId);
    if (!tweet) return;
    
    const modal = document.getElementById('reply-modal');
    const originalTweetDiv = document.getElementById('original-tweet');
    const aiSuggestionsDiv = document.getElementById('ai-suggestions');
    
    // Display the original tweet
    originalTweetDiv.innerHTML = `
        <div class="tweet-header">
            <div class="profile-pic">S</div>
            <div class="tweet-user">
                <div class="tweet-name">${tweet.name}</div>
                <div class="tweet-handle">${tweet.handle}</div>
            </div>
        </div>
        <div class="tweet-content">${tweet.content}</div>
        <div class="tweet-date">${tweet.date}</div>
    `;
    
    // Show loading state for suggestions
    aiSuggestionsDiv.innerHTML = '<div class="suggestion-loading">Generating smart replies...</div>';
    modal.style.display = 'block';
    
    if (extensionConnected) {
        // Request AI suggestions from the extension
        extensionPort.postMessage({
            action: 'generateReplies',
            tweetId: tweetId,
            tweetContent: tweet.content
        });
    } else {
        // Generate reply suggestions locally if extension not available
        setTimeout(() => {
            const suggestions = generateAIReplySuggestions(tweet.content);
            displayAIReplySuggestions(suggestions);
        }, 2000);
    }
}

// Find a tweet by its ID
function findTweetById(tweetId) {
    return twitterFeedData.find(tweet => tweet.id === tweetId);
}

// Generate AI reply suggestions locally (mock implementation)
function generateAIReplySuggestions(tweetContent) {
    // Default suggestions based on content analysis
    const suggestions = [
        {
            type: 'Supportive',
            content: 'This is fantastic news! SP1 continues to push the boundaries of what's possible with zero-knowledge proofs. Looking forward to exploring the new features!'
        },
        {
            type: 'Curious',
            content: 'Interesting development! Could you share more details about how this compares to other zkVM implementations? Particularly interested in the performance aspects.'
        },
        {
            type: 'Technical',
            content: 'The STARK-based approach seems very promising. Have you published any benchmarks comparing recursive proof generation times with previous versions?'
        },
        {
            type: 'Educational',
            content: 'For those new to zkVMs, this is a great example of how zero-knowledge proofs are becoming more accessible to mainstream developers. SP1 is making complex cryptography practical!'
        }
    ];
    
    // If we can detect specific keywords in the tweet, we could customize further
    if (tweetContent.toLowerCase().includes('webinar') || tweetContent.toLowerCase().includes('event')) {
        suggestions.push({
            type: 'RSVP',
            content: 'Just registered for the webinar - excited to learn more about building with SP1! Will there be a hands-on component or demo during the session?'
        });
    }
    
    if (tweetContent.toLowerCase().includes('hiring') || tweetContent.toLowerCase().includes('job') || tweetContent.toLowerCase().includes('career')) {
        suggestions.push({
            type: 'Career',
            content: 'The work you're doing at Succinct is groundbreaking! I'm curious - what kind of background do you look for in engineering candidates for the STARK/zkVM team?'
        });
    }
    
    return suggestions;
}

// Display AI reply suggestions in the modal
function displayAIReplySuggestions(suggestions) {
    const aiSuggestionsDiv = document.getElementById('ai-suggestions');
    
    if (!suggestions || suggestions.length === 0) {
        aiSuggestionsDiv.innerHTML = '<div class="suggestion-loading">Unable to generate suggestions at this time.</div>';
        return;
    }
    
    aiSuggestionsDiv.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const suggestionEl = document.createElement('div');
        suggestionEl.className = 'ai-reply';
        suggestionEl.innerHTML = `
            <div class="ai-reply-header">
                <div class="ai-reply-type">${suggestion.type}</div>
                <div class="ai-reply-action" onclick="copyToClipboard('${encodeURIComponent(suggestion.content)}')">Copy</div>
            </div>
            <div class="ai-reply-content">${suggestion.content}</div>
        `;
        
        suggestionEl.addEventListener('click', function() {
            copyToClipboard(suggestion.content);
        });
        
        aiSuggestionsDiv.appendChild(suggestionEl);
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    // Decode if needed
    if (typeof text !== 'string') {
        return;
    }
    
    text = decodeURIComponent(text);
    
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // Execute copy command
        const successful = document.execCommand('copy');
        const msg = successful ? 'Copied to clipboard!' : 'Could not copy text.';
        
        // Show a temporary message
        const notification = document.createElement('div');
        notification.textContent = msg;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.background = 'var(--neon-pink)';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
        
        // Remove after 2 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    } catch (err) {
        console.error('Error copying text: ', err);
    }
    
    // Clean up
    document.body.removeChild(textarea);
}

// Check connection to Chrome extension
function checkExtensionConnection() {
    // Try to connect to the extension
    try {
        // This will only work if the extension is installed and has the correct permissions
        // Using a custom extension ID that would match your extension
        if (window.chrome && chrome.runtime && chrome.runtime.connect) {
            extensionPort = chrome.runtime.connect('succinctlabshelper', {name: 'succinct-chat'});
            
            extensionPort.onMessage.addListener(function(message) {
                handleExtensionMessage(message);
            });
            
            extensionPort.onDisconnect.addListener(function() {
                extensionConnected = false;
                console.log('Extension disconnected');
            });
            
            // Send a ping to check if we're connected
            extensionPort.postMessage({
                action: 'ping'
            });
            
            // We'll wait for the pong in the message handler
            setTimeout(() => {
                if (!extensionConnected) {
                    updateExtensionStatus(false);
                }
            }, 1000);
        } else {
            updateExtensionStatus(false);
        }
    } catch (e) {
        console.log('Error connecting to extension:', e);
        updateExtensionStatus(false);
    }
}

// Handle messages from Chrome extension
function handleExtensionMessage(message) {
    console.log('Received message from extension:', message);
    
    switch (message.action) {
        case 'pong':
            extensionConnected = true;
            updateExtensionStatus(true);
            break;
            
        case 'tweetsFetched':
            displayTweets(message.tweets);
            break;
            
        case 'repliesGenerated':
            displayAIReplySuggestions(message.suggestions);
            break;
            
        case 'error':
            handleExtensionError(message.error);
            break;
    }
}

// Update the extension status UI
function updateExtensionStatus(connected) {
    const statusElement = document.getElementById('extension-status');
    
    if (connected) {
        statusElement.innerHTML = `
            <p style="color: var(--neon-blue);">The Chrome extension is successfully connected! ✅</p>
            <p>You can now use the full features:</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                <li>Scrape tweets from Twitter/X</li>
                <li>Generate AI-powered reply suggestions</li>
                <li>Post replies directly from the extension</li>
            </ul>
        `;
    } else {
        statusElement.innerHTML = `
            <p>The Chrome extension is not installed or not active.</p>
            <p>To install the extension:</p>
            <ol>
                <li>Download the extension files from the project</li>
                <li>Go to chrome://extensions/</li>
                <li>Enable Developer mode</li>
                <li>Click "Load unpacked" and select the extension folder</li>
            </ol>
        `;
    }
}

// Handle errors from the extension
function handleExtensionError(error) {
    console.error('Extension error:', error);
    
    if (error.includes('scrape')) {
        const twitterFeed = document.getElementById('twitter-feed');
        twitterFeed.innerHTML = `<div class="tweet"><div class="tweet-content">Error scraping tweets: ${error}</div></div>`;
    } else if (error.includes('reply')) {
        const aiSuggestionsDiv = document.getElementById('ai-suggestions');
        aiSuggestionsDiv.innerHTML = `<div class="suggestion-loading">Error generating replies: ${error}</div>`;
    }
}

// Send message handler for chat
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const query = userInput.value.trim();
    
    if (!query) return;
    
    displayMessage({ sender: 'user', content: query });
    userInput.value = '';
    
    const typingMessage = displayMessage({
        sender: 'bot',
        content: 'Succinct is typing...',
        isTyping: true
    });

    setTimeout(() => {
        const chatArea = document.getElementById('chat-area');
        chatArea.removeChild(typingMessage);
        
        const response = generateResponse(query);
        displayMessage({ sender: 'bot', content: response });
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 1500);
}

// Suggestion handler
function suggestQuery(query) {
    document.getElementById('user-input').value = query;
    sendMessage();
}

// Display message utility
function displayMessage(message) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}${message.isTyping ? ' typing' : ''}`;
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    
    const avatar = document.createElement('div');
    avatar.className = `avatar ${message.sender}`;
    avatar.textContent = message.sender === 'bot' ? 'S' : 'U';
    
    headerDiv.appendChild(avatar);
    messageDiv.appendChild(headerDiv);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = message.content;
    messageDiv.appendChild(contentDiv);
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    return messageDiv;
}

// Response generator with Twitter integration
function generateResponse(query) {
    query = query.toLowerCase();

    // Twitter-related queries
    if (query.includes('tweet') || query.includes('twitter') || query.includes('latest update') || 
        query.includes('news') || query.includes('latest tweets') || query.includes('show tweets')) {
        fetchTwitterFeed();
        return "I've refreshed the @SuccinctLabs Twitter feed on the right. You can see their latest posts there. Want me to summarize any specific tweet for you?";
    }

    if (query.includes('summarize tweets') || query.includes('twitter summary')) {
        const summary = twitterFeedData.map(tweet => 
            `- ${tweet.date}: ${tweet.content.replace(/<a.*?>|<\/a>/g, '')}`).join('<br>');
        return `Here's a summary of recent @SuccinctLabs tweets:<br>${summary}`;
    }

    if (query.includes('scrape') || query.includes('get tweets')) {
        scrapeTweets();
        return "I'm attempting to scrape recent tweets from @SuccinctLabs. This requires the Chrome extension to be installed and properly configured.";
    }

    if (query.includes('extension') || query.includes('chrome extension')) {
        document.getElementById('extension-modal').style.display = 'block';
        return "I've opened the Chrome extension information panel. You'll need to install our extension to enable tweet scraping and AI reply generation.";
    }

    if (query.includes('what's new') || query.includes('recent updates')) {
        const latestTweet = twitterFeedData[0];
        return `The latest update from @SuccinctLabs (posted on ${latestTweet.date}):<br>"${latestTweet.content}"<br>Check the Twitter feed for more!`;
    }

    // General queries
    if (query.includes('what do you do') || query.includes('what are you') || query.includes('who are you')) {
        return "I'm Succinct CHAT, your AI assistant for all things Succinct! I can answer questions about SP1, fetch the latest updates from @SuccinctLabs' Twitter feed, and help you generate AI-powered replies to tweets. Ask me anything! 🚀";
    }
    if (query.includes('what is sp1') || query.includes('sp1 overview')) {
        return knowledge.sp1.introduction;
    }
    if (query.includes('features') || query.includes('capabilities') || query.includes('what can sp1 do')) {
        return `SP1 offers several powerful features:<br><br>• ${knowledge.sp1.features.join('<br>• ')}<br><br>These features make SP1 ideal for a wide range of zero-knowledge applications.`;
    }
    if (query.includes('why use') || query.includes('benefits') || query.includes('advantages')) {
        return knowledge.sp1.why_use;
    }
    if (query.includes('zkvm') || query.includes('zero-knowledge') || query.includes('virtual machine')) {
        return knowledge.sp1.zkvm;
    }
    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        return "Hey there! I'm here to assist with Succinct-related questions, show you the latest from @SuccinctLabs on Twitter, or help you generate AI-powered replies to tweets. What's on your mind?";
    }
    if (query.includes('thank')) {
        return "You're welcome! Anything else I can help you with?";
    }
    if (query.includes('rust') || query.includes('c++') || query.includes('programming')) {
        return "SP1 supports writing provable programs in Rust and C++ with minimal overhead, making zero-knowledge app development accessible and efficient. Want to know more about this?";
    }
    if (query.includes('stark')) {
        return "SP1 leverages STARKs (Scalable Transparent ARguments of Knowledge) for its proving system. STARKs offer transparency (no trusted setup) and scalability, perfect for secure, high-performance computations.";
    }
    if (query.includes('performance') || query.includes('speed') || query.includes('fast')) {
        return "SP1 is engineered for high performance, delivering fast proving times with minimal overhead while maintaining zero-knowledge proof security. Ideal for practical, efficient applications!";
    }
    if (query.includes('use case') || query.includes('application')) {
        return "SP1 shines in use cases like verifiable state transitions, off-chain computation proofs, privacy-preserving verification, and trustless apps. Any specific application you're curious about?";
    }
    if (query.includes('scrape') || query.includes('chronie')) {
        return "To scrape tweets, you'll need to install our Chrome extension. This extension can automatically collect tweets from @SuccinctLabs and generate AI-powered reply suggestions. Would you like instructions on how to install it?";
    }

    return "I'm not sure I have an answer for that. Try asking about SP1, its features, @SuccinctLabs' Twitter updates, or how to use our Chrome extension for tweet scraping and AI replies!";
} 