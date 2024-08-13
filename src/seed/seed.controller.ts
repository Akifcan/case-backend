import { Controller, Get, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../modules/category/category.entity'
import { User } from '../modules/user/user.entity'
import { UserRole } from '../modules/user/user.types'
import { Repository } from 'typeorm'
import { CategoryI18n } from '../modules/category/category-i18n.entity'
import { Currency, Locale } from '../shared/shared.types'
import { Product } from '../modules/product/entities/product.entity'
import { ProductI18n } from '../modules/product/entities/product-i18n.entity'
import { ProductImage } from '../modules/product/entities/product-image.entity'
import { ProductPricing } from '../modules/product/entities/product-pricing.entity'
import { Public } from '../decorators/is-public.decorator'
import { open } from 'fs/promises'
import { join } from 'path'
import { Comment } from '../modules/comment/entities/comment.entity'

@Controller('seed')
export class SeedController {
  @InjectRepository(User) userRepository: Repository<User>
  @InjectRepository(Category) categoryRepository: Repository<Category>
  @InjectRepository(CategoryI18n) categoryI18nRepository: Repository<CategoryI18n>
  @InjectRepository(Product) productRepository: Repository<Product>
  @InjectRepository(ProductI18n) productI18nRepository: Repository<ProductI18n>
  @InjectRepository(ProductImage) productImageRepository: Repository<ProductImage>
  @InjectRepository(ProductPricing) productPriceRepository: Repository<ProductPricing>
  @InjectRepository(Comment) commentRepository: Repository<Comment>

  @Public()
  @Get()
  async seed() {
    // Remove existing records
    await this.userRepository.delete({})
    await this.categoryRepository.delete({})
    await this.productRepository.delete({})

    // Users
    await this.userRepository.save(
      this.userRepository.create([
        {
          name: 'akifcan',
          email: 'akifcannnn@icloud.com',
          role: UserRole.admin,
          password: 'test123A%',
        },
        {
          name: 'john doe',
          email: 'johndoe@mail.com',
          role: UserRole.user,
          password: 'test123A%',
        },
      ]),
    )

    const category1 = await this.categoryRepository.save(this.categoryRepository.create())
    const category2 = await this.categoryRepository.save(this.categoryRepository.create())

    await this.categoryI18nRepository.save(
      this.categoryI18nRepository.create([
        {
          name: 'Shoes',
          slug: 'shoes',
          language: Locale.en,
          category: category1,
        },
        {
          name: 'Ayakkabı',
          slug: 'ayakkabilar',
          language: Locale.tr,
          category: category1,
        },
        {
          name: 'T-shirts',
          slug: 'tshirts',
          language: Locale.en,
          category: category2,
        },
        {
          name: 'Tişört',
          slug: 'tistortler',
          language: Locale.tr,
          category: category2,
        },
      ]),
    )

    const product1 = await this.productRepository.save(
      this.productRepository.create({
        category: category1,
      }),
    )

    const product2 = await this.productRepository.save(
      this.productRepository.create({
        category: category1,
      }),
    )

    const product3 = await this.productRepository.save(
      this.productRepository.create({
        category: category2,
      }),
    )

    const product4 = await this.productRepository.save(
      this.productRepository.create({
        category: category2,
      }),
    )

    const product5 = await this.productRepository.save(
      this.productRepository.create({
        category: category1,
      }),
    )

    const product6 = await this.productRepository.save(
      this.productRepository.create({
        category: category2,
      }),
    )

    const product7 = await this.productRepository.save(
      this.productRepository.create({
        category: category2,
      }),
    )

    await this.productI18nRepository.save(
      this.productI18nRepository.create([
        {
          name: 'Nike Mavi Ayakkabı',
          description: 'Çok güzel mavi ayakkabı',
          product: product1,
          language: Locale.tr,
          slug: 'nike-mavi-ayakkabi',
        },
        {
          name: 'Nike Blue Shoe',
          description: 'Good blue shoe',
          product: product1,
          language: Locale.en,
          slug: 'nike-blue-shoe',
        },
        {
          name: 'Adidas Kırmızı Ayakkabı',
          description: 'Adidas kırmızı ayakkabı',
          product: product2,
          language: Locale.tr,
          slug: 'adidas-kirmizi-ayakkabi',
        },
        {
          name: 'Adidas Red Shoe',
          description: 'Adidas red shoe good',
          product: product2,
          language: Locale.en,
          slug: 'adidas-red-shoe',
        },
        {
          name: 'Kırmızı Tişört',
          description: 'Güzel kırmızı tişört',
          product: product3,
          language: Locale.tr,
          slug: 'kirmizi-tisort',
        },
        {
          name: 'Red t-shirt',
          description: 'Good red tshirt',
          product: product3,
          language: Locale.en,
          slug: 'red-tisort',
        },
        {
          name: 'Mavi Tişört',
          description: 'Güzel mavi tişört',
          product: product4,
          language: Locale.tr,
          slug: 'mavi-tisort',
        },
        {
          name: 'Mavi t-shirt',
          description: 'Good blue tshirt',
          product: product4,
          language: Locale.en,
          slug: 'mavi-tshirt',
        },
        {
          name: 'puma ayakkabi',
          description: 'Puma ayakkabı',
          product: product5,
          language: Locale.tr,
          slug: 'puma-ayakkabi',
        },
        {
          name: 'Puma Shoe',
          description: 'puma shoe',
          product: product5,
          language: Locale.en,
          slug: 'puma-shoe',
        },
        {
          name: 'beyaz tişört',
          description: 'tişört',
          product: product6,
          language: Locale.tr,
          slug: 'beyaz-tisort',
        },
        {
          name: 'white t-shirt',
          description: 'tshirt',
          product: product6,
          language: Locale.en,
          slug: 'white-tshirt',
        },
        {
          name: 'siyah tişört',
          description: 'tişört',
          product: product7,
          language: Locale.tr,
          slug: 'siyah-tisort',
        },
        {
          name: 'black tshirt',
          description: 'Good blue shoe',
          product: product7,
          language: Locale.en,
          slug: 'black-tshirt',
        },
      ]),
    )

    await this.productImageRepository.save(
      this.productImageRepository.create([
        {
          altTag: 'nike',
          src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlrZSUyMHJlZCUyMHNob2V8ZW58MHx8MHx8fDA%3D',
          product: product1,
        },
        {
          altTag: 'nike',
          src: 'https://images.unsplash.com/photo-1474494819794-90f9664b530d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmlrZSUyMHJlZCUyMHNob2V8ZW58MHx8MHx8fDA%3D',
          product: product1,
        },
        {
          altTag: 'adidas',
          src: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWRpZGFzJTIwYmx1ZSUyMHNob2V8ZW58MHx8MHx8fDA%3D',
          product: product2,
        },
        {
          altTag: 'adidas',
          src: 'https://images.unsplash.com/photo-1520256788229-d4640c632e4b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWRpZGFzJTIwYmx1ZSUyMHNob2V8ZW58MHx8MHx8fDA%3D',
          product: product2,
        },
        {
          altTag: 'tshirt',
          src: 'https://plus.unsplash.com/premium_photo-1697876203137-3a87c8f066c1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          product: product3,
        },
        {
          altTag: 'tshirt',
          src: 'https://plus.unsplash.com/premium_photo-1708110918835-4cf7886a54c1?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          product: product3,
        },
        {
          altTag: 'tshirt',
          src: 'https://images.unsplash.com/photo-1659423269449-361b455d3cb5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ymx1ZSUyMHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D',
          product: product4,
        },
        {
          altTag: 'tshirt',
          src: 'https://plus.unsplash.com/premium_photo-1661698419172-856cdbe5a03f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          product: product4,
        },
        {
          altTag: 'shoe',
          src: 'https://images.unsplash.com/photo-1545289414-1c3cb1c06238?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHB1bWElMjBzaG9lfGVufDB8fDB8fHww',
          product: product5,
        },
        {
          altTag: 'shoe',
          src: 'https://images.unsplash.com/photo-1542562566-c1f9c7d7e737?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          product: product5,
        },
        {
          altTag: 'tshirt',
          src: 'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          product: product6,
        },
        {
          altTag: 'tshirt',
          src: 'https://plus.unsplash.com/premium_photo-1682096340835-022e6647b698?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          product: product6,
        },
        {
          altTag: 'tshirt',
          src: 'https://images.unsplash.com/photo-1574462282113-38aa607fec36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxhY2slMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
          product: product7,
        },
        {
          altTag: 'tshirt',
          src: 'https://plus.unsplash.com/premium_photo-1688497831535-120bd47d9f9c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxhY2slMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
          product: product7,
        },
      ]),
    )

    await this.productPriceRepository.save(
      this.productPriceRepository.create([
        {
          price: 200,
          discountPrice: 150,
          currency: Currency.tl,
          product: product1,
        },
        {
          price: 40,
          discountPrice: null,
          currency: Currency.euro,
          product: product1,
        },
        {
          price: 38,
          discountPrice: null,
          currency: Currency.dollar,
          product: product1,
        },
        {
          price: 250,
          discountPrice: 100,
          currency: Currency.tl,
          product: product2,
        },
        {
          price: 50,
          discountPrice: null,
          currency: Currency.euro,
          product: product2,
        },
        {
          price: 49,
          discountPrice: null,
          currency: Currency.dollar,
          product: product2,
        },
        {
          price: 300,
          discountPrice: 100,
          currency: Currency.tl,
          product: product3,
        },
        {
          price: 30,
          discountPrice: null,
          currency: Currency.euro,
          product: product3,
        },
        {
          price: 29,
          discountPrice: null,
          currency: Currency.dollar,
          product: product3,
        },
        {
          price: 300,
          discountPrice: 100,
          currency: Currency.tl,
          product: product4,
        },
        {
          price: 30,
          discountPrice: null,
          currency: Currency.euro,
          product: product4,
        },
        {
          price: 29,
          discountPrice: null,
          currency: Currency.dollar,
          product: product4,
        },
        {
          price: 100,
          discountPrice: 53,
          currency: Currency.tl,
          product: product5,
        },
        {
          price: 28,
          discountPrice: null,
          currency: Currency.euro,
          product: product5,
        },
        {
          price: 27,
          discountPrice: null,
          currency: Currency.dollar,
          product: product5,
        },
        {
          price: 100,
          discountPrice: 39,
          currency: Currency.tl,
          product: product6,
        },
        {
          price: 28,
          discountPrice: null,
          currency: Currency.euro,
          product: product6,
        },
        {
          price: 27,
          discountPrice: null,
          currency: Currency.dollar,
          product: product6,
        },
        {
          price: 100,
          discountPrice: 39,
          currency: Currency.tl,
          product: product7,
        },
        {
          price: 28,
          discountPrice: null,
          currency: Currency.euro,
          product: product7,
        },
        {
          price: 27,
          discountPrice: null,
          currency: Currency.dollar,
          product: product7,
        },
      ]),
    )

    return 'ok'
  }

  @Public()
  @Get('external-comment-merge')
  async externalComment() {
    /*

      PLEASE READ THIS:

      - Let's say we have a large file import and need to import the db.
      - This file is large and we need to avoid memory overload/memory pressure.
      - For avoiding memory pressure we'll fetch the data chunk by chunk. 
      - In this case highWaterMark: 50

    */

    await this.commentRepository.delete({})
    const fileHandleRead = await open(join(__dirname, '../', '../public', 'external-comment-mock.txt'), 'r')
    const streamRead = fileHandleRead.createReadStream({ highWaterMark: 50, encoding: 'utf-8' })

    let data = ''

    streamRead.on('data', (chunk) => {
      data += chunk.toString('utf-8')
    })

    streamRead.on('end', async () => {
      streamRead.removeAllListeners()
      const parsed = JSON.parse(JSON.parse(data))
      for await (const x of parsed) {
        const product = await this.productI18nRepository.findOne({
          relations: ['product'],
          select: { id: true, product: { id: true } },
          where: { slug: x.productSlug },
        })
        await this.commentRepository.save(
          this.commentRepository.create({
            content: x.content,
            product: { id: product.product.id },
            locale: x.locale,
          }),
        )
      }
      Logger.log('DONE', 'Merge comment')
    })

    return { message: 'started' }
  }
}
