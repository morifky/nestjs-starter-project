import { Controller, Get, Param, Post, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/models/product.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { createProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary:"Find all products" })
  @ApiResponse({ status: 200, description: 'Return all products' })
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @ApiOperation({ summary:"Get product by product Id" })
  @ApiResponse({ status: 200, description: 'Return product' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  @Get(':id')
  findOne(@Param('id') id:string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary:"Create product" })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.'})
  @Post()
  create(@Body() createProductDto: createProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary:"Update product" })
  @ApiResponse({ status: 204, description: 'The product has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  @HttpCode(204)
  @Put(':id')
  update(@Param('id') id:string, @Body() createProductDto: createProductDto) {
    return this.productService.update(id,createProductDto);
  }

  @ApiOperation({ summary:"Delete product" })
  @ApiResponse({ status: 204, description: 'The product has been successfully deleted.'})
  @ApiResponse({ status: 404, description: 'Data not found' })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id:string) {
    return this.productService.remove(id);
  }
}
