import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateTaskStatus,
} from '../validators/taskValidator.js';

const router = Router();

router.get('/', taskController.getAllTasks);
router.get('/search', taskController.searchTasks);
router.get('/weeks', taskController.getWeeklyTasks);
router.post('/', validateCreateTask, taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', validateUpdateTask, taskController.updateTask);
router.patch('/:id/status', validateUpdateTaskStatus, taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

export default router;
