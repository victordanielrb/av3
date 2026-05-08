import { Router } from 'express';
import { RelatorioController } from '../controllers/relatorioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const ctrl = new RelatorioController();

router.get('/saved', authMiddleware, ctrl.listar.bind(ctrl));
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.salvar.bind(ctrl));
router.get('/:codigo', authMiddleware, roleMiddleware(['ADMINISTRADOR', 'ENGENHEIRO']), ctrl.gerar.bind(ctrl));

export default router;
