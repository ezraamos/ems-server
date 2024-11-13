import connectToDatabase from './db/db';
import User from './models/User';
import bcrypt from 'bcrypt';

const userRegister = async () => {
  connectToDatabase();
  try {
    const hashPassword = await bcrypt.hash('admin', 10);
    const newUser = new User({
      name: 'admin',
      email: 'admin@gmail.com',
      password: hashPassword,
      role: 'admin',
    });

    await newUser.save();
  } catch (error) {
    console.log(error);
  }
};

userRegister();
