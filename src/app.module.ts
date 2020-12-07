import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.gaurd';
import { typeOrmConfig } from './config/typeorm.config';
import { ItemsModule } from './items/items.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ItemsModule,
    JwtModule.register({
      secret: "It'sSupposedToBeSecret",
      signOptions: {
        expiresIn: 360000,
      },
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: "smtp.mailtrap.io",
        port: "2525",
        tls: {
          servername: "smtp.mailtrap.io",
        },
        secure: false, 
        auth: {
          user: "87868887e23db4",
          pass: "d0e69aae59aea5",
        },
      },
      template: {
        dir: "./templates",
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],

  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
