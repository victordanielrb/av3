import { Router } from 'express';
import { TesteController } from '../controllers/testeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router({ mergeParams: true });
const ctrl = new TesteController();

router.get('/', authMiddleware, ctrl.findByAeronave.bind(ctrl));
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.create.bind(ctrl));

export default router;
