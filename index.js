const express = require('express');
const cors = require('cors'); // Include CORS package
const app = express();

app.use(cors()); // Use CORS before your routes are set up
app.use(express.static('public'));
app.use(express.json());

// Endpoint to perform the Clearbit API call
app.post('/enrich', async (req, res) => {
  console.log('Request body:', req.body); // Log the incoming request body
  // ... rest of the endpoint code
  const { email } = req.body;
  const clearbitApiKey = process.env.CLEARBIT_API_KEY; // Stored in Replit Secrets
  const url = `https://person.clearbit.com/v2/people/find?email=${email}`;

  // Dynamically import node-fetch
  const fetch = (await import('node-fetch')).default;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${clearbitApiKey}`
      }
    });
    const data = await response.json();
    console.log('Clearbit response:', data); // Log the Clearbit response
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});