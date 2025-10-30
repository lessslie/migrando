import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    
        // async getNotifications(userId: string, page: number, limit: number) {
        //     const skip = (page - 1) * limit;
    
        //     const [notifications, totalCount] = await this.prisma.$transaction([
        //     this.prisma.notification.findMany({
        //         where: { userId },
        //         orderBy: { createdAt: 'desc' },
        //         skip,
        //         take: limit,
        //     }),
        //     this.prisma.notification.count({ where: { userId } }),
        //     ]);
    
        //     return {
        //     notifications,
        //     pagination: {
        //         page,
        //         limit,
        //         totalCount,
        //         totalPages: Math.ceil(totalCount / limit),
        //     },
        //     };
        // }
    
        // async markNotificationAsRead(userId: string, notificationId: string) {
        //     const notification = await this.prisma.notification.findUnique({
        //     where: { id: notificationId },
        //     });
    
        //     if (!notification) {
        //     throw new NotFoundException('Notification not found');
        //     }
    
        //     if (notification.userId !== userId) {
        //     // Forbidden (403) si intenta marcar la notificación de otro usuario
        //     throw new ForbiddenException('Access denied to this notification');
        //     }
    
        //     // Utiliza un update seguro para solo cambiar el campo si no está leído
        //     const updated = await this.prisma.notification.update({
        //     where: { id: notificationId, read: false }, // Condición para evitar update innecesario
        //     data: { read: true },
        //     });
            
        //     return updated;
        // }
    
        // async markAllNotificationsAsRead(userId: string) {
        //     const { count } = await this.prisma.notification.updateMany({
        //     where: { 
        //         userId: userId,
        //         read: false,
        //     },
        //     data: { read: true },
        //     });
            
        //     return { count };
        // }
}
