import bcrypt from "bcryptjs";

export async function generateHash(content: string) {
  try {
    const hash = await bcrypt.hash(content, 10); 
    return hash;
  } catch (err) {
    console.error("Erro ao criptografar o conteúdo:", err);
    throw err;
  }
}

export async function verifyPassword(password: string, hash: string) {
  try {
    const isMatch = await bcrypt.compare(password,hash);
    return isMatch; 
  } catch (err) {
    console.error("Erro ao verificar a senha:", err);
    throw err;
  }
}
