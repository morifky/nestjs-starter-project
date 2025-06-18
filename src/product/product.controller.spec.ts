import { Product } from '@/models/product.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { createProductDto } from './dto/create-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

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
    it('should return paginated products', async () => {
      const products = [
        {
          id: '1',
          name: 'Test Product',
          price: 100,
          description: 'Test Description',
          created_at: null,
          updated_at: null,
        },
      ];

      const paginatedResult = {
        items: products,
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedResult);

      const paginationDto = { page: 1, limit: 10 };
      const filterOptions = {};

      const result = await controller.findAll(paginationDto, filterOptions);

      expect(result).toBe(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
        {},
      );
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

      const createdProduct = {
        id: '1',
        ...createDto,
        created_at: null,
        updated_at: null,
      };

      jest
        .spyOn(service, 'create')
        .mockResolvedValue(createdProduct as Product);

      const result = await controller.create(createDto);

      expect(result).toBe(createdProduct);
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

      const updatedProduct = {
        id: '1',
        ...updateDto,
        created_at: null,
        updated_at: null,
      };

      jest
        .spyOn(service, 'update')
        .mockResolvedValue(updatedProduct as Product);

      const result = await controller.update('1', updateDto);

      expect(result).toBe(updatedProduct);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
