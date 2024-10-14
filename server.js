// server.js
import express from 'express'; // Use import instead of require
import cors from 'cors'; // Use import instead of require

// Dynamic import for node-fetch
import fetch from 'node-fetch';

const app = express();

// Enable CORS for your frontend origin
app.use(cors({
    origin: 'http://localhost:5173' // Replace with your frontend's origin
}));

// Proxy route to handle requests from the frontend
app.get('/api/securitytrails/:domain', async (req, res) => {
    const { domain } = req.params;
    console.log("backend domain coming is :",domain)
    const apiUrl = `https://api.securitytrails.com/v1/domain/${domain}/subdomains?children_only=false&include_inactive=true`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'apikey': 'CMqMHf7jNUJ56UhZfreHm8Eb-Nzvzihm'
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        res.json(data);  // Send the response back to the frontend
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from SecurityTrails API.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});