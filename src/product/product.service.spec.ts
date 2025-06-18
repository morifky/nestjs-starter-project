import { Product } from '@/models/product.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const paginationDto = { page: 1, limit: 10 };

      jest.spyOn(repo, 'findAndCount').mockResolvedValue([products, 1]);

      const result = await service.findAll(paginationDto);

      expect(result).toEqual({
        items: products,
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 0,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const product = {
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        created_at: null,
        updated_at: null,
      };

      jest.spyOn(repo, 'findOne').mockResolvedValue(product);

      const result = await service.findOne('1');
      expect(result).toEqual(product);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: undefined,
      });
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'New Product',
        price: 150,
        description: 'New Description',
      };

      const createdProduct = {
        id: '1',
        ...createProductDto,
        created_at: null,
        updated_at: null,
      };

      jest.spyOn(repo, 'create').mockReturnValue(createdProduct as any);
      jest.spyOn(repo, 'save').mockResolvedValue(createdProduct as any);

      const result = await service.create(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(repo.create).toHaveBeenCalledWith(createProductDto);
      expect(repo.save).toHaveBeenCalledWith(createdProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        price: 200,
        description: 'Updated Description',
      };

      const existingProduct = {
        id: '1',
        name: 'Old Product',
        price: 100,
        description: 'Old Description',
        created_at: null,
        updated_at: null,
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateProductDto,
      };

      jest.spyOn(repo, 'findOne').mockResolvedValue(existingProduct as any);
      jest.spyOn(repo, 'merge').mockReturnValue(updatedProduct as any);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedProduct as any);

      const result = await service.update('1', updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: undefined,
      });
      expect(repo.merge).toHaveBeenCalledWith(
        existingProduct,
        updateProductDto,
      );
      expect(repo.save).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = {
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        created_at: null,
        updated_at: null,
      };

      jest.spyOn(repo, 'findOne').mockResolvedValue(product as any);
      jest.spyOn(repo, 'remove').mockResolvedValue(undefined);

      await service.remove('1');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: undefined,
      });
      expect(repo.remove).toHaveBeenCalledWith(product);
    });
  });
});
