
import { billList } from '../controllers/billing.js';
import authorization from '../middleware/authorization.js';

export default function billRouter(express){
  const router = express.Router();

  router
    .route('/billing-list')
    .get(authorization(),billList);
  return router;
}
