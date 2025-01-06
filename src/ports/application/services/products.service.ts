import { PRODUCT_REPOSITORY } from '@adapters/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateProductDto,
  ReturnProductDto,
  UpdateProductDto,
} from '@ports/application/dto';
import {
  ProductsRepositoryProtocol,
  ProductsServiceProtocol,
} from '@ports/application/protocols';
import { Notification, Product } from '@ports/domain/entities';
import { Result } from 'typescript-result';

@Injectable()
export class ProductsService implements ProductsServiceProtocol {
  private readonly _logger = new Logger(ProductsService.name, {
    timestamp: true,
  });
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productsRepository: ProductsRepositoryProtocol,
  ) {}

  public async getById(id: string): Promise<Result<ReturnProductDto, Notification>> {
    this._logger.log(`Getting product by id: ${id}`);
    const product = await this.productsRepository.getById(id);
    if (!product) {
      this._logger.warn(`Product not found`);
      return Result.error({ message: 'Product not found' });
    }
    this._logger.log(`Product found: ${product.title}`);
    return Result.ok({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.image,
      reviewScore: product.reviewScore,
    });
  }
  public async getAll(
    skip?: number,
    take?: number,
  ): Promise<Result<ReturnProductDto[], Notification>> {
    this._logger.log(`Getting all products`);
    const products = await this.productsRepository.getAll(skip, take)
    this._logger.log(`Products found: ${products.length}`);
    return Result.ok(
      products.map((product) => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.image,
        reviewScore: product.reviewScore,
      })),
    );
  }
}
