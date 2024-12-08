// /src/routes/fetchRoute.ts

import { Router, Request, Response } from 'express';
import { fetchExamineData } from '../product/fetchData';

const router = Router();

// Endpoint to fetch data from examine.com
router.get('/fetch/:type/:query', async (req: Request, res: Response) => {
    const { type, query } = req.params;

    try {
        // Fetch the data using the fetchExamineData function
        const data = await fetchExamineData(type, query);
        // Return the fetched data as a JSON response
        res.status(200).json(data);
    } catch (error) {
        // Handle errors and send error response
        res.status(500).json({ error: error.message });
    }
});

export { router as fetchRoute };

