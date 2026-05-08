import { Router } from 'express';
import { TesteController } from '../controllers/testeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const ctrl = new TesteController();

router.delete('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.delete.bind(ctrl));

export default router;
