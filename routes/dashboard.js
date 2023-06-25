
import { dashboardData } from '../controllers/dashboard.js';
import authorization from '../middleware/authorization.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';

export default function dashRouter(express){
  const router = express.Router();

  router
    .route('/dashboard')
    .get(authorization(), dashboardData)
  .all(methodNotAllowed)
  return router;
}
