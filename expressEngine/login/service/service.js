import jwt from 'jsonwebtoken';

// import service libraries
import { BaseService, DBService } from '../../lib/service';

// import collections
import { User, userToken } from '../../model';

// import validateRequired
import { validateRequired } from '../../lib/validationHandler';
import { error, success } from '../../cms/user';

// import utils
import loginHelper from '../../utils/login';

class LoginService {
    login = async ({ body }) => {
      const { email, password: loginPassword } = body;
      const projection = loginHelper.getProjection();

      const isExist = await DBService.findOne(User, { email }, projection);
      if (!isExist) {
        return { error: error.loginError };
      }

      const { password: hashPassword = '', id: userId = '' } = isExist;
      const match = await loginHelper.checkUser({ loginPassword, hashPassword });
      if (!match || match.error) {
        return { error: error.passwordError };
      }

      const dataToFind = {
        collection: userToken,
        data: { email },
        limit: 1,
      };
      const checkToken = await DBService.find(dataToFind);
      if (checkToken && checkToken.length) {
        const [{ userId: tokenForUser = '' }] = checkToken;
        await DBService.deleteOne(userToken, { userId: tokenForUser });
      }

      const token = await loginHelper.createToken({ data: body });
      if (!token || token.error) {
        return { error: error.tokenError };
      }

      const storeToken = await DBService.create(userToken, {
        email,
        userId,
        token,
      });
      if (!storeToken) {
        return { error: error.token };
      }

      return { data: storeToken.token, message: 'token is generated' };
    }

    forgot = async ({ body }) => {
      const { email } = body;

      const projection = loginHelper.getProjection();
      const isExist = await DBService.findOne(User, { email }, projection);
      if (!isExist) {
        return { error: error.loginError };
      }

      const token = await loginHelper.createToken({ data: { email } });
      if (!token || token.error) {
        return { error: error.tokenError };
      }

      const storeToken = await DBService.updateOne(User,
        { email },
        { resetToken: token });
      if (!storeToken) {
        return { error: error.token };
      }

      // const mail = await loginHelper.sendMail({ to: email, html: `<html>${token}</html>` });
      // if (!mail || mail.error) {
      //   return { error: 'error in change password' };
      // }
      return { message: 'please check your mail' };
    }

    reset = async ({ body }) => {
      const { password, token: resetToken } = body;

      const projection = loginHelper.getProjection();
      const isExist = await DBService.findOne(User, { resetToken }, projection);
      if (!isExist) {
        return { error: 'invalid token entered' };
      }

      const { email } = jwt.decode(resetToken);

      const storeToken = await DBService.updateOne(User,
        { email }, { password });
      if (!storeToken || storeToken.error) {
        return storeToken;
      }
      console.log('\\\\\\--------', storeToken);
      return { message: 'successfully updated password' };
    }
}

export default new LoginService();
