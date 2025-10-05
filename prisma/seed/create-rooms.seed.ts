import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createRoomsSeed() {
    // Salas
    const rooms = [
        { name: 'Sala de Reuniões 1', capacity: 10 }
    ];

    for (const room of rooms) {
        await prisma.room.create({
            data: room,
        });
    }

    console.log('👥 Salas criadas.');
    return rooms;
}