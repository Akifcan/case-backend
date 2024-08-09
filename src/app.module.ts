import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DbConfig, JwtProps } from './config/config.interface'
import { AuthModule } from './modules/auth/auth.module'
import { ProductModule } from './modules/product/product.module'
import configuration from './config/configuration'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './modules/auth/auth.guard'
import { JwtModule } from '@nestjs/jwt'
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DbConfig>('database')
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          synchronize: true,
          autoLoadEntities: true,
        }
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwt = configService.get<JwtProps>('jwt')
        return {
          global: true,
          secret: jwt.secret,
          signOptions: { expiresIn: jwt.expires },
        }
      },
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
