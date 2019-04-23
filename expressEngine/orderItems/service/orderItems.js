// import service libraries
import { BaseService, DBService } from '../../lib/service/index';

// import collections
import { orderItem } from '../../model/index';
// import messages
//import cms from '../../cms/orderItems/index';

class Service extends BaseService {
  registerOrderItems = async (data) => {
    try {
      const requiredFields = ["orderId", "productId", "unitPrice", "qunatity"];
      
      this.validateRequired(data, requiredFields);
      
      const orderItems = await DBService.create(orderItem, {
        orderId: data.orderId,
        productId: data.productId,
        unitPrice: data.unitPrice,
        qunatity: data.qunatity,
      });

      return this.success(orderItems/* , cms */);
    } catch (err) {
      return this.error(err);
    }
  }
}

export default new Service();
