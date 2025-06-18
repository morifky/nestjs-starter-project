import { Product } from '@/models/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createProductDto } from './dto/create-product.dto';
import { BaseRepositoryService } from '@/base/services/base-repository.service';
@Injectable()
export class ProductService extends BaseRepositoryService<
  Product,
  createProductDto
> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }
}
