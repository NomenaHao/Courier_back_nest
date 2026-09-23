import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { User } from './entities/user.entity';
import { Location } from './entities/location.entity';
import { Order } from './entities/order.entity';
import { DeliveryAssignment } from './entities/delivery-assignment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', '127.0.0.1'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Location, Order, DeliveryAssignment],
        synchronize: false,
        timezone: 'Z',
      }),
    }),
    AuthModule,
    OrdersModule,
    NotificationsModule,
  ],
})
export class AppModule {}
