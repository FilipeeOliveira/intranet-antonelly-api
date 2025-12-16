import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Communique } from '@prisma/client'
import { Server } from 'socket.io'

interface CommuniqueCreatedPayload {
    id: string;
    title: string;
    description: string;
    severity: string;
    imagePath: string;
    authorId: string;
    sectorId: string;
    createdAt: Date;
    updatedAt: Date;
    sector: {
        id: string;
        description: string;
        name: string;
    };
    author: {
        id: string;
        sector: {
            id: string;
            description: string;
            name: string;
        };
        name: string;
        email: string;
        role: {
            id: string;
            description: string;
            key: string;
        };
    };
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CommuniquesGateway {
    @WebSocketServer()
    server: Server

    emitCreated(communique: CommuniqueCreatedPayload) {
        this.server.emit('communique.created', communique)
    }   

    emitUpdated(communique: Communique) {
        this.server.emit('communique.updated', communique)
    }

    emitDeleted(id: string) {
        this.server.emit('communique.deleted', { id })
    }
}
