
import { dashboardData } from '../controllers/dashboard.js';
import authorization from '../middleware/authorization.js';

export default function dashRouter(express){
  const router = express.Router();

  router
    .route('/dashboard')
    .get(authorization(),dashboardData);
  return router;
}
