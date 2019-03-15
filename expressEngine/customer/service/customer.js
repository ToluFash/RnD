// import service libraries
import { BaseService, DBService } from '../../lib/service/index';

// import collections
import { Customer } from '../../model/index';

// import messages
import { error, success } from '../../cms/customer/index';

class Service extends BaseService {
  registerCustomer = async (data) => {
    try {      
      const requiredFields = ["firstName", "lastName", "city", "country", "contactNo"];
      this.validateRequired(data, requiredFields);

      const isExist = await DBService.count(Customer, { firstName: data.firstName, lastName: data.lastName });
      if (isExist) {
        return this.error(error.alreadyRegistered);
      }

      const customer = await DBService.create(Customer, {
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        country: data.country,
        contact: data.contactNo,
      });

      return this.success(customer, success.customerRegistered);
    } catch(err) {
      return this.error(err);
    }
  }
}

export default new Service();