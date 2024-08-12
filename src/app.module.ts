import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppConfig, DbConfig, JwtProps, RedisConfig } from './config/config.interface'
import { AuthModule } from './modules/auth/auth.module'
import { ProductModule } from './modules/product/product.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './modules/auth/auth.guard'
import { JwtModule } from '@nestjs/jwt'
import { CategoryModule } from './modules/category/category.module'
import { HeaderResolver, I18nModule } from 'nestjs-i18n'
import configuration from './config/configuration'
import { join } from 'path'
import { SeedModule } from './seed/seed.module'
import { BasketModule } from './modules/basket/basket.module'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { CommentModule } from './modules/comment/comment.module'

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<CacheModuleAsyncOptions> => {
        const redisConfig = configService.get<RedisConfig>('redis')
        const store = await redisStore({
          ttl: redisConfig.ttl,
          socket: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
        })
        return {
          store: () => store,
        } as any
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.getOrThrow<DbConfig>('database')
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
        const jwt = configService.getOrThrow<JwtProps>('jwt')
        return {
          global: true,
          secret: jwt.secret,
          signOptions: { expiresIn: jwt.expires },
        }
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          fallbackLanguage: configService.getOrThrow<AppConfig>('app').fallbackLanguage,
          loaderOptions: {
            path: join(__dirname, '/i18n/'),
            watch: true,
          },
          typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
        }
      },
      resolvers: [new HeaderResolver(['x-lang'])],
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    SeedModule,
    BasketModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
