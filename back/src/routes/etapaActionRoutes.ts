import { Router } from 'express';
import { EtapaController } from '../controllers/etapaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const ctrl = new EtapaController();

router.patch('/:id/iniciar', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']), ctrl.iniciar.bind(ctrl));
router.patch('/:id/finalizar', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']), ctrl.finalizar.bind(ctrl));
router.post('/:id/funcionarios', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.addFuncionario.bind(ctrl));
router.get('/:id/funcionarios', authMiddleware, ctrl.listFuncionarios.bind(ctrl));
router.delete('/:id/funcionarios/:fid', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.removeFuncionario.bind(ctrl));
router.delete('/:id', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.delete.bind(ctrl));

export default router;
