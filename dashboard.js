const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

let ethDaiPrice = 0;

// Fetch ETH/DAI price (replace with actual data source)
async function fetchPrice() {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=dai');
    const data = await res.json();
    ethDaiPrice = data.ethereum.dai;  // Replace with actual price data path
}

// Route to serve the dashboard
app.get('/', async (req, res) => {
    await fetchPrice();
    res.send(`
    <html>
        <head>
            <title>ETH/DAI LP Monitoring</title>
        </head>
        <body>
            <h1>ETH/DAI LP Dashboard</h1>
            <p>Current ETH/DAI Price: ${ethDaiPrice}</p>
            <canvas id="priceChart" width="400" height="200"></canvas>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                const ctx = document.getElementById('priceChart').getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['1', '2', '3', '4', '5'],
                        datasets: [{
                            label: 'ETH/DAI Price',
                            data: [${ethDaiPrice}, ${ethDaiPrice+10}, ${ethDaiPrice-10}, ${ethDaiPrice}, ${ethDaiPrice+5}],
                            borderColor: 'rgba(0, 123, 255, 1)',
                            fill: false
                        }]
                    }
                });
            </script>
        </body>
    </html>
    `);
});

app.listen(port, () => {
    console.log(`Dashboard running at http://localhost:${port}`);
});
