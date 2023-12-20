// Importing PrismaClient from the Prisma library
import { PrismaClient } from '@prisma/client'

// Function that creates a new instance of PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Defining a type based on the return type of prismaClientSingleton function
type prismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// Creating a special way to access the global object with a specific type
const globalForPrisma = globalThis as unknown as {
    prisma: prismaClientSingleton | undefined
}

// Checking if there's already a Prisma instance; if not, create a new one
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Exporting the Prisma instance as the default export
export default prisma

// If it's not in production mode, store the Prisma instance globally
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
