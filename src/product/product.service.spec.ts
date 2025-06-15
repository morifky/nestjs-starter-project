import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../models/product.entity';
import { Repository, Timestamp } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockProductRepository = {
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
    it('should return an array of products', async () => {
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
      jest.spyOn(repo, 'find').mockResolvedValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(repo.find).toHaveBeenCalled();
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
      jest.spyOn(repo, 'findOneOrFail').mockResolvedValue(product);

      const result = await service.findOne('1');
      expect(result).toEqual(product);
      expect(repo.findOneOrFail).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'New Product',
        price: 150,
        description: 'New Description',
      };

      jest.spyOn(repo, 'insert').mockResolvedValue(undefined);

      await service.create(createProductDto);
      expect(repo.insert).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        price: 200,
        description: 'Updated Description',
      };

      jest.spyOn(repo, 'update').mockResolvedValue(undefined);

      await service.update('1', updateProductDto);
      expect(repo.update).toHaveBeenCalledWith('1', updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue(undefined);

      await service.remove('1');
      expect(repo.delete).toHaveBeenCalledWith('1');
    });
  });
});
