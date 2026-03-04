import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createRoomsSeed() {
    // Salas
    const rooms = [
        { name: 'Sala de Reuniões 1', location: 'Andar 1 - Ala A', capacity: 10 }
        , { name: 'Sala de Reuniões 2', location: 'Andar 1 - Ala B', capacity: 20 }
    ];

    for (const room of rooms) {
        await prisma.room.upsert({
            where: { name: room.name },
            update: {},
            create: room,
        });
    }

    console.log('👥 Salas criadas.');
    return rooms;
}