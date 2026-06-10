import { prisma } from "../../config/prisma";

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  createUser(data: any) {
    return prisma.user.create({ data });
  }

  createRefreshToken(data: any) {
    return prisma.refreshToken.create({ data });
  }

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } });
  }

 
deleteRefreshTokensByUser(userId: string) {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
}
}