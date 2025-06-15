import { Injectable } from '@nestjs/common';
import { Product } from '../models/product.entity';
import { Repository } from 'typeorm';
import { IProduct } from 'src/common/interfaces/product';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly itemRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.itemRepository.find();
  }

  create(product: IProduct) {
    this.itemRepository.insert(product);
  }

  findOne(id: string): Promise<Product> {
    return this.itemRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: string, product: IProduct) {
    this.itemRepository.update(id, product);
  }

  remove(id: string) {
    this.itemRepository.delete(id);
  }
}
