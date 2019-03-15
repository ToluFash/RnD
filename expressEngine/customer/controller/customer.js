// import base controller
import { BaseController } from '../../lib/controller/index';

// import service
import { CustomerService } from '../service/index';

class CustomerController extends BaseController  {
  create = async ({body}) => {
    const { firstName, lastName, city, country, contactNo } = body;
    try {
      return await CustomerService.registerCustomer({ firstName, lastName, city, country, contactNo });
    } catch (err) {
      return err;
    }
  };
};

export default new CustomerController();