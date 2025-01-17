import { defineEventHandler, readBody } from 'h3';
import {PrismaClient} from '@prisma/client';

const createUser = async(name: string,  email: string, password:string) => {
    const prisma = new PrismaClient() 
    const user = await prisma.user.create({
        data:{ 
            name: name,
            email: email,
            password: password
        }
    }).finally(async () => {
        await prisma.$disconnect()
    })

    return user
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const user = await createUser(body.name, body.email, body.password)
    return {data: user}
})