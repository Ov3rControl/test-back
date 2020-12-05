import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemRepository } from './items.repository';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: "It'sSupposedToBeSecret",
      signOptions: {
        expiresIn: 3600,
      },
    }),
    AuthModule,
  ],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
