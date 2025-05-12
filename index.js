const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const bot = new Telegraf('YOUR_BOT_TOKEN'); // Replace with your bot token

let minPrice = 2300;  // Example minimum price for ETH/DAI
let maxPrice = 2700;  // Example maximum price for ETH/DAI

// Fetch ETH/DAI price (dummy API used for example)
async function fetchPrice() {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=dai');
    const data = await res.json();
    return data.ethereum.dai;  // Replace with the correct price path
}

// Command to fetch the price
bot.command('price', async (ctx) => {
    const price = await fetchPrice();
    ctx.reply(`Current ETH/DAI price: ${price}`);
});

// Command to set an alert for ETH/DAI price range
bot.command('alert', async (ctx) => {
    const price = await fetchPrice();
    if (price < minPrice) {
        ctx.reply(`Alert: ETH/DAI price is below the minimum range (${minPrice}). Current price: ${price}`);
    } else if (price > maxPrice) {
        ctx.reply(`Alert: ETH/DAI price is above the maximum range (${maxPrice}). Current price: ${price}`);
    } else {
        ctx.reply(`ETH/DAI price is within the range.`);
    }
});

// Start the bot
bot.launch();
