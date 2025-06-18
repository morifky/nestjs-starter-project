import { Repository, FindOptionsWhere, FindManyOptions, Like } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { BaseDto } from '../interfaces/base-dto.interface';
import { PaginationResult } from '../../base/interfaces/pagination-result.interface';
import { FilterOptions } from '../../base/interfaces/filter-options.interface';
import { PaginationDto } from '../dto/pagination.dto';

export abstract class BaseRepositoryService<
  T extends BaseEntity,
  D extends BaseDto,
> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(
    paginationDto?: PaginationDto,
    filterOptions?: FilterOptions,
    relations?: string[],
  ): Promise<PaginationResult<T>> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<T> = {
      take: limit,
      skip,
      relations,
    };

    // Apply filters if provided
    if (filterOptions) {
      const where: any = {};

      // Process filter options
      Object.keys(filterOptions).forEach((key) => {
        const value = filterOptions[key];

        // Skip undefined or null values
        if (value === undefined || value === null) {
          return;
        }

        // Handle string search with LIKE
        if (typeof value === 'string' && !value.match(/^[0-9]+$/)) {
          where[key] = Like(`%${value}%`);
        } else {
          where[key] = value;
        }
      });

      if (Object.keys(where).length > 0) {
        findOptions.where = where as FindOptionsWhere<T>;
      }
    }

    // Get paginated results
    const [items, totalItems] = await this.repository.findAndCount(findOptions);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: string, relations?: string[]): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return entity;
  }

  async create(createDto: D): Promise<T> {
    const entity = this.repository.create(createDto as any);
    const result = await this.repository.save(entity);
    return Array.isArray(result) ? result[0] : result;
  }

  async update(id: string, updateDto: D): Promise<T> {
    const entity = await this.findOne(id);

    const updatedEntity = this.repository.merge(entity, updateDto as any);

    const result = await this.repository.save(updatedEntity);
    return Array.isArray(result) ? result[0] : result;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
