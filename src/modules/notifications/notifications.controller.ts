import { Controller } from '@nestjs/common';

@Controller('notifications')
export class NotificationsController {


    // estas notificaciones deberian ir en este modulo
//     @Get('notifications')
//     @ApiOperation({ summary: 'Obtener lista de notificaciones (con paginación)' })
//     getNotifications(
//         @AuthUser() user: UserPayload,
//         @Query() { page, limit }: PaginationDto,
//     ) {
//         return this.usersService.getNotifications(user.userId, page, limit);
//     }

//     @Put('notifications/mark-all-read')
//     @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
//     markAllRead(@AuthUser() user: UserPayload) {
//         return this.usersService.markAllNotificationsAsRead(user.userId);
//     }

//     @Put('notifications/:id/read')
//     @ApiOperation({ summary: 'Marcar una notificación como leída' })
//     markNotificationAsRead(
//         @AuthUser() user: UserPayload,
//         @Param('id') notificationId: string,
//     ) {
//         return this.usersService.markNotificationAsRead(user.userId, notificationId);
//     }


}
