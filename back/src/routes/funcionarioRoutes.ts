import { Router } from 'express';
import { FuncionarioController } from '../controllers/funcionarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const ctrl = new FuncionarioController();

router.get('/me', authMiddleware, ctrl.me.bind(ctrl));
router.get('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.findAll.bind(ctrl));
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR']), ctrl.create.bind(ctrl));
router.delete('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR']), ctrl.delete.bind(ctrl));

export default router;
