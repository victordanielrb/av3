import { Router } from 'express';
import { PecaController } from '../controllers/pecaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const ctrl = new PecaController();

router.patch('/:id/status', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']), ctrl.updateStatus.bind(ctrl));
router.delete('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.delete.bind(ctrl));

export default router;
