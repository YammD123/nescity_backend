import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserRequest } from 'src/common/interfaces/request.interface';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ){}

    @Get()
    @UseGuards(AuthGuard)
    public async getNotification(
        @Req() req:UserRequest
    ) {
        return this.notificationService.getNotification(req.user.id);
    }

    @Patch()
    @UseGuards(AuthGuard)
    public async updateNotification(
        @Req() req:UserRequest
    ) {
        return this.notificationService.updateNotification(req.user.id);
    }
}
