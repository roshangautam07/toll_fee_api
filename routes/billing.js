
import { billDetails, billList } from '../controllers/billing.js';
import authorization from '../middleware/authorization.js';

export default function billRouter(express){
  const router = express.Router();

  router
    .route('/billing-list')
      .get(authorization(), billList);
    
      router
      .route('/billing-details')
      .post(authorization(),billDetails);
  return router;
}
