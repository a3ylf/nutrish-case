// /src/config/server.ts

import express from 'express';
import { statusRoute } from './routes/health';
import { fetchRoute } from './routes/fetch';

// Initialize the Express app
const app = express();

// Middleware to parse incoming requests with JSON payload
app.use(express.json());

// Mount routes
app.use(statusRoute);
app.use(fetchRoute);

// Start the server
const port = 1212;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

