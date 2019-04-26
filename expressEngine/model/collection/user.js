import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// import model library methods
import modelLib from '../lib';

const SALT_WORK_FACTOR = 10;
const { Schema } = mongoose;

const UserSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: email => modelLib.validateEmail(email),
      message: props => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: password => modelLib.validatePassword(password),
      message: 'password must have atleast 8 characters, atleast 1 uppaercase, atleast 1 lowercase, atleast 1 special char and atleast 1 integer!',
    },
  },
  lastLogin: {
    type: Date,
  },
  role: {
    type: String,
    enum: modelLib.roleEnum,
    required: true,
  },
  companyName: {
    type: String,
  },
  contactName: {
    type: String,
  },
  contactTitle: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  phone: {
    type: Number,
  },
  fax: {
    type: String,
  },
  resetToken: {
    type: String,
  },
}, { collection: 'user', timestamps: true });

/**
 * Pre hooks
 */
UserSchema.pre('save', async function preSave() {
  console.log('save ---');
  const user = this;
  user.userId = user._id.toString();
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR); // salt generation
  const hash = await bcrypt.hash(user.password, salt); // encrypting password
  user.password = hash; // save encrypted text as password
});
UserSchema.post('updateOne', async function preUpdate() {
  // const user = this;
  console.log('password', this._update.$set.password);
  const hash = await bcrypt.hash(this._update.$set.password, 10); // encrypting password
  console.log('hash----', hash);
  if (this._update.$set.password) { this.update({}, { $set: { password: hash } }); }
  console.log('-----', this._update.$set.password);
  // user.update({}, { $set: { password: bcrypt.hash(user.password, 10) } });
});

// index
UserSchema.index({ email: 1 }, {
  unique: true,
});

const User = mongoose.model('User', UserSchema);

export default User;
