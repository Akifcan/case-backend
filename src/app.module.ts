import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DbConfig } from './config/config.interface'
import { AuthModule } from './modules/auth/auth.module'
import { ProductModule } from './modules/product/product.module';
import configuration from './config/configuration'

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
    UserModule,
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
