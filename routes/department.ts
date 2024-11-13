import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {
  addDepartment,
  editDepartment,
  getDepartments,
  deleteDepartment,
  getDepartment,
} from '../controllers/departmentController';

const router = Router();

router.post('/add', authMiddleware, addDepartment);
router.get('/', authMiddleware, getDepartments);

router.get('/:id', authMiddleware, getDepartment);
router.put('/:id', authMiddleware, editDepartment);
router.delete('/:id', authMiddleware, deleteDepartment);

export default router;
