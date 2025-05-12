// index.js
const axios = require('axios');
const { Telegraf } = require('telegraf');

// Telegram bot token
const bot = new Telegraf('your-telegram-bot-token');

// Uniswap V3 or The Graph API (Change the API endpoint if using a specific Uniswap data source)
const UNISWAP_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const MIN_PRICE = 2300; // Minimum DAI/ETH
const MAX_PRICE = 2648; // Maximum DAI/ETH
const ACTIVE_PRICE = 2478; // Active DAI/ETH

// Function to get the current ETH/DAI price
async function getCurrentPrice() {
  try {
    const query = `
      {
        pool(id: "your-pool-id") {
          token0Price
          token1Price
        }
      }
    `;
    const response = await axios.post(UNISWAP_GRAPH_URL, { query });
    const data = response.data.data.pool;
    const price = data.token0Price; // Assuming token0 is ETH and token1 is DAI
    return parseFloat(price);
  } catch (error) {
    console.error('Error fetching price:', error);
  }
}

// Function to send Telegram alerts
async function sendAlert(message) {
  try {
    await bot.telegram.sendMessage('your-chat-id', message);
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

// Monitor price and send alerts if out of range
async function monitorPrice() {
  const price = await getCurrentPrice();

  if (price < MIN_PRICE) {
    await sendAlert(`Price is too low! Current Price: ${price} DAI/ETH`);
  } else if (price > MAX_PRICE) {
    await sendAlert(`Price is too high! Current Price: ${price} DAI/ETH`);
  } else if (price > ACTIVE_PRICE - 50 && price < ACTIVE_PRICE + 50) {
    await sendAlert(`Price is in the active range! Current Price: ${price} DAI/ETH`);
  }

  setTimeout(monitorPrice, 30000); // Check every 30 seconds
}

monitorPrice(); // Start monitoring

bot.launch();
