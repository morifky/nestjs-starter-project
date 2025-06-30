import { Product } from '@/models/product.entity';
import { Controller, UseGuards, Post, Put, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { createProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { BaseController } from '@/base/controllers/base.controller';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController extends BaseController<
  Product,
  createProductDto
> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }

  @ApiBody({ type: createProductDto })
  @Post()
  async create(createDto: createProductDto) {
    return super.create(createDto);
  }

  @ApiBody({ type: createProductDto })
  @Put(':id')
  @HttpCode(204)
  async update(id: string, updateDto: createProductDto) {
    return super.update(id, updateDto);
  }
}
