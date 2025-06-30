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
import { ApiQuery, ApiBody } from '@nestjs/swagger';
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
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterOptions: any,
  ): Promise<PaginationResult<T>> {
    const { page, limit, ...filters } = filterOptions || {};
    const pagination = new PaginationDto();
    pagination.page = page ? parseInt(page) : 1;
    pagination.limit = limit ? parseInt(limit) : 10;

    return await this.service.findAll(pagination, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return await this.service.findOne(id);
  }

  @Post()
  @ApiBody({ type: Object })
  async create(@Body() createDto: D): Promise<T> {
    return await this.service.create(createDto);
  }

  @Put(':id')
  @HttpCode(204)
  @ApiBody({ type: Object })
  async update(@Param('id') id: string, @Body() updateDto: D): Promise<T> {
    return await this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
