import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint to check if the server is online
router.get('/status', (req: Request, res: Response) => {
    res.status(200).send("Ok");
});

export { router as statusRoute };
