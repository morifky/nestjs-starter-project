import { Product } from '@/models/product.entity';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
}
