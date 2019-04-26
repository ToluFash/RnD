// import base controller
import { BaseController } from '../../lib/controller';

// import service
import userService from '../service';

class Controller extends BaseController {
  login = async (data) => {
    const loginData = await userService.login(data);
    return loginData;
  };

  forgot = async (data) => {
    console.log('inside forgot of controller');
    const forgotPassword = await userService.forgot(data);
    return forgotPassword;
  }

  sendgrid = async (data) => {
    console.log('data in web book is -- ', data.body);
    return true;
  }
}
export default new Controller();
