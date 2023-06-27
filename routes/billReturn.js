
import { billDetails, billList, store } from '../controllers/billing.js';
import { billReturn } from '../controllers/billReturn.js';
import authorization from '../middleware/authorization.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';

export default function billRouter(express){
  const router = express.Router();
    
      router
      .route('/cancel-bill')
        .post(authorization(), billReturn)
        .all(methodNotAllowed);
  return router;
}
