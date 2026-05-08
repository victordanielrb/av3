import { Router } from 'express';
import { AeronaveController } from '../controllers/aeronaveController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const ctrl = new AeronaveController();

router.get('/', authMiddleware, ctrl.findAll.bind(ctrl));
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.create.bind(ctrl));
router.get('/:codigo', authMiddleware, ctrl.findByCodigo.bind(ctrl));
router.put('/:codigo', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.update.bind(ctrl));
router.delete('/:codigo', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.delete.bind(ctrl));

export default router;
