import { Router } from 'express';
import { PecaController } from '../controllers/pecaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router({ mergeParams: true });
const ctrl = new PecaController();

router.get('/', authMiddleware, ctrl.findByAeronave.bind(ctrl));
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.create.bind(ctrl));

export default router;
