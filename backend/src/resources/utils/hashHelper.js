import bcrypt from 'bcrypt';

const rounds = 10;

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, rounds);
  return hash;
};

const checkHashedPassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

export { hashPassword, checkHashedPassword };
