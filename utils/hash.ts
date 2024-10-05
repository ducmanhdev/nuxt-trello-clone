import bcrypt from 'bcryptjs'

export const generateHash = async (data: string, saltRound: number = 10) => {
  const salt = await bcrypt.genSalt(saltRound)
  return await bcrypt.hash(data, salt)
}
