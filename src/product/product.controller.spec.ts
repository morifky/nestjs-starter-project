import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { createProductDto } from './dto/create-product.dto';
import { Product } from '../models/product.entity';
import { Timestamp } from 'typeorm';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [
        {
          id: '1',
          name: 'Test Product',
          price: 100,
          description: 'Test Description',
          created_at: null,
          updated_at: null,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result: Product = {
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        created_at: null,
        updated_at: null,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto: createProductDto = {
        name: 'New Product',
        price: 150,
        description: 'New Description',
      };
      
      jest.spyOn(service, 'create').mockImplementation();

      await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: createProductDto = {
        name: 'Updated Product',
        price: 200,
        description: 'Updated Description',
      };
      
      jest.spyOn(service, 'update').mockImplementation();

      await controller.update('1', updateDto);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(service, 'remove').mockImplementation();

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});