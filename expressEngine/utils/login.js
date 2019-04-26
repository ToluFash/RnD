import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mailgun from 'mailgun-js';

class LoginHelper {
  getProjection = () => {
    const projection = {
      email: 1,
      password: 1,
    };
    return projection;
  };

  checkUser = async ({ loginPassword = '', hashPassword = '' }) => {
    try {
      const match = await bcrypt.compare(loginPassword, hashPassword);
      return match;
    } catch (err) {
      return { error: err };
    }
  };

  createToken = async ({ data }) => {
    try {
      const { KEY: key = 'successive' } = process.env;
      const token = await jwt.sign(data, key);
      return token;
    } catch (err) {
      return { error: err };
    }
  }

  sendMail = async ({
    from = 'noReply@RnD.tech', to = '', html = '', text = 'fogot password', subject = 'forgot password',
  }) => {
    const mGun = mailgun({ apiKey: process.env.API_KEY, domain: process.env.DOMAIN });
    const dataToMail = {
      from,
      to,
      subject,
      text,
      html,
    };
    try {
      const mail = await mGun.messages().send(dataToMail);
      return mail;
    } catch (err) {
      return { error: err };
    }
  }
}

export default new LoginHelper();
