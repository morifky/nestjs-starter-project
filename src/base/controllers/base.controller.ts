import {
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BaseRepositoryService } from '../services/base-repository.service';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { BaseDto } from '../interfaces/base-dto.interface';
import { PaginationDto } from '../../base/dto/pagination.dto';
import { PaginationResult } from '../../base/interfaces/pagination-result.interface';

export abstract class BaseController<T extends BaseEntity, D extends BaseDto> {
  constructor(protected readonly service: BaseRepositoryService<T, D>) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterOptions?: any,
  ): Promise<PaginationResult<T>> {
    // Extract pagination parameters
    const { page, limit, ...filters } = filterOptions || {};

    // Create pagination DTO
    const pagination = new PaginationDto();
    pagination.page = page ? parseInt(page) : 1;
    pagination.limit = limit ? parseInt(limit) : 10;

    return this.service.findAll(pagination, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createDto: D): Promise<T> {
    return this.service.create(createDto);
  }

  @Put(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() updateDto: D): Promise<T> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
