import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

await prisma.user.upsert({
    where: { email: 'admin@lia.com' },
    update: {},
    create: {
        name: 'Administrador',
        email: 'admin@lia.com',
        password: hashedPassword,
        level: 99,
        xp: 9999,
    },
});

console.log('🌱 Admin seed completada: admin@lia.com / admin123');
}

main()
    .then(async () => {
        await prisma.$disconnect();
})
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
});
