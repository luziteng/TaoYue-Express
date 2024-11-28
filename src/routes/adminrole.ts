import { Router } from 'express';
import { addStore,getStores,getStoreById,updateStore,deleteStore } from '../controllers/storeController';

const router = Router();

router.post('/stores', addStore);
router.get('/store/list', getStores);
router.get('/store/list/:id', getStoreById);
router.put('/store/edit/:id', updateStore);
router.delete('/store/delete/:id', deleteStore);
export default router;
