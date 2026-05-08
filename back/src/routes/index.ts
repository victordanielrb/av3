import { Router } from 'express';
import authRoutes from './authRoutes';
import aeronaveRoutes from './aeronaveRoutes';
import funcionarioRoutes from './funcionarioRoutes';
import pecaRoutes from './pecaRoutes';
import pecaActionRoutes from './pecaActionRoutes';
import etapaRoutes from './etapaRoutes';
import etapaActionRoutes from './etapaActionRoutes';
import testeRoutes from './testeRoutes';
import testeActionRoutes from './testeActionRoutes';
import relatorioRoutes from './relatorioRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/aeronaves', aeronaveRoutes);
router.use('/aeronaves/:codigo/pecas', pecaRoutes);
router.use('/pecas', pecaActionRoutes);
router.use('/aeronaves/:codigo/etapas', etapaRoutes);
router.use('/etapas', etapaActionRoutes);
router.use('/aeronaves/:codigo/testes', testeRoutes);
router.use('/testes', testeActionRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/relatorios', relatorioRoutes);

export default router;
