import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import RecordController from '../controllers/record.controller';

const router = Router();

router.post('/records', authMiddleware, RecordController.queryRecords);
// router.post('/records', RecordController.queryRecords);

export default router;
