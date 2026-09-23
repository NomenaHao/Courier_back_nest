import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LivreurGuard } from '../common/livreur.guard';
import { AdminGuard } from '../common/admin.guard';
import { User } from '../entities/user.entity';
import { AssignDelivererDto, CreateOrderDto } from './orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post('create/')
  @UseGuards(JwtAuthGuard)
  create(@Req() req: { user: User }, @Body() dto: CreateOrderDto) {
    return this.orders.createOrder(req.user, dto);
  }

  @Get('my-orders/')
  @UseGuards(JwtAuthGuard)
  myOrders(@Req() req: { user: User }) {
    return this.orders.myOrders(req.user);
  }

  @Get('my-deliveries/')
  @UseGuards(JwtAuthGuard, LivreurGuard)
  myDeliveries(@Req() req: { user: User }) {
    return this.orders.myDeliveries(req.user);
  }

  @Get('admin/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminList(@Query() query: Record<string, string | undefined>) {
    return this.orders.adminList(query);
  }

  @Post(':id/assign/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignDelivererDto,
  ) {
    return this.orders.assignDeliverer(id, dto.deliverer_id);
  }

  @Post(':id/assignment/:action/')
  @UseGuards(JwtAuthGuard, LivreurGuard)
  assignmentAction(
    @Param('id', ParseIntPipe) id: number,
    @Param('action') action: string,
    @Req() req: { user: User },
  ) {
    return this.orders.assignmentAction(id, action, req.user);
  }
}
