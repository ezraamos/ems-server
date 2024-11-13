import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
} from '../controllers/employeeController';

const router = Router();

router.post('/add', authMiddleware, addEmployee);

router.get('/', authMiddleware, getEmployees);

router.get('/:id', authMiddleware, getEmployee);
router.put('/:id', authMiddleware, updateEmployee);

// router.put('/:id', authMiddleware, editDepartment);
// router.delete('/:id', authMiddleware, deleteDepartment);

export default router;
