// import service libraries
import { BaseService, DBService } from '../../lib/service';

// import collections
import { User, userToken } from '../../model';

// import validateRequired
import { validateRequired } from '../../lib/validationHandler';
import { error, success } from '../../cms/user';

// import utils
import loginHelper from '../../utils/login';

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const nodemailer = require('nodemailer');
// // const mailgun = require('mailgun-js');
// const emailit = require('emailit');

// const DOMAIN = 'sandbox614fb522e50c4fefbc5ce7b4e5d7048f.mailgun.org';
// const api_key = '2e7eb0b2dd8081313acc9109083bf92d-dc5f81da-52c4d6fe';
// const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
class LoginService extends BaseService {
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

      const storeToken = await DBService.Update(User, {
        resetToken: token,
      });
      if (!storeToken) {
        return { error: error.token };
      }

      // const mail = await loginHelper.sendMail({ to: 'yogeshsingh201197@gmail.com', html: '<html>click here to change</html>' });
      // console.log('mail ---', mail);
      // if (!mail || mail.error) {
      //   return { error: 'error in change password' };
      // }
      return true;
    }
}

export default new LoginService();
