import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
  try {
    const saltRounds = parseInt(process.env.SALT || "12", 10);
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPwd = await bcrypt.hash(password, salt);
    if (!hashedPwd) {
      console.log("error while creating password hashing");
      return null;
    }
    return hashedPwd;
  } catch (error) {
    console.error("Password hashing error", error.stcak);
    return null;
  }
};

export const unHashedPassword = async (hashedPassword, plainPassword) => {
  try {
    const exisitingPwd = await bcrypt.compareSync(
      hashedPassword,
      plainPassword
    );
    return exisitingPwd;
  } catch (error) {
    console.log("error while doing password matching", error.stack);
    return false;
  }
};
