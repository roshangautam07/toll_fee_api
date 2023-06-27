
import { billDetails, billList, store } from '../controllers/billing.js';
import authorization from '../middleware/authorization.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';

export default function billRouter(express){
  const router = express.Router();

  router
    .route('/billing-list')
    .get(authorization(), billList)
    .all(methodNotAllowed);
    
      router
      .route('/billing-details')
        .post(authorization(), billDetails)
        .all(methodNotAllowed);

  router
    .route('/billingStore')
    .post(authorization(), store);
  return router;
}
