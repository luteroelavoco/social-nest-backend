import mongoose from 'mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

describe('BooksController', () => {
  let booksController: BooksController;
  let booksService: BooksService;

  const createdBook = {
    title: 'title',
    author: 'author',
    description: 'description',
    avatar: 'path/avatar',
    owner: {
      _id: new mongoose.Types.ObjectId('64b95781dc3fb7f79e6bb5b0'),
      firstName: 'Augusto',
      lastName: 'Manuel',
      email: 'teste1@gmail.com',
      role: 'user',
      verified: true,
      address: {
        state: 'SP',
        city: 'São Paulo',
        street: 'Rua Antônio das Chagas',
        number: 1429,
        complement: 'Sem complemento',
        cep: '04714-001',
        neighborhood: 'Chácara Santo Antônio (Zona Sul)',
        _id: '64ed968aad8c772938829949',
      },
      createdAt: '2023-07-20T15:49:21.451Z',
      updatedAt: '2023-08-29T06:56:10.355Z',
      __v: 0,
    },
    _id: '64eec5d5c616cd2c8a7ab62d',
    createdAt: '2023-08-30T04:30:13.186Z',
    updatedAt: '2023-08-30T04:30:13.186Z',
    __v: 0,
  };

  beforeEach(() => {
    booksService = new BooksService({} as any, {} as any);
    booksController = new BooksController(booksService);
  });

  it('should be defined', () => {
    expect(booksController).toBeDefined();
  });

  it('should create a book', async () => {
    const createBookDto: CreateBookDto = {
      title: 'title',
      author: 'author',
      description: 'description',
      owner: new mongoose.Types.ObjectId('64b95781dc3fb7f79e6bb5b0'),
      avatar: 'path/avatar',
    };

    jest.spyOn(booksService, 'create').mockResolvedValue(createdBook as any);

    const result = await booksController.create(createBookDto);

    expect(booksService.create).toHaveBeenCalledWith(
      expect.objectContaining(createBookDto),
    );
    expect(result).toBe(createdBook);
  });

  it('should return search results', async () => {
    const search = 'tit';
    const searchResults = [createdBook];

    jest.spyOn(booksService, 'search').mockResolvedValue(searchResults as any);

    const result = await booksController.search(search);
    expect(booksService.search).toHaveBeenCalledWith(search);
    expect(result).toBe(searchResults);
  });

  it('should return empty search results', async () => {
    const search = 'bolha de neve';
    const searchResults = [];

    jest.spyOn(booksService, 'search').mockResolvedValue(searchResults as any);

    const result = await booksController.search(search);
    expect(booksService.search).toHaveBeenCalledWith(search);
    expect(result).toStrictEqual([]);
  });

  it('should return available books', async () => {
    const search = 'author';
    const availableBooks = [createdBook];

    jest
      .spyOn(booksService, 'available')
      .mockResolvedValue(availableBooks as any);

    const result = await booksController.available(search);
    expect(booksService.available).toHaveBeenCalledWith(search);
    expect(result).toBe(availableBooks);
  });

  it('should return empty available results', async () => {
    const search = 'bolha de neve';
    const availableBooks = [];

    jest
      .spyOn(booksService, 'available')
      .mockResolvedValue(availableBooks as any);

    const result = await booksController.available(search);
    expect(booksService.available).toHaveBeenCalledWith(search);
    expect(result).toStrictEqual([]);
  });

  it('should return book finded by id ', async () => {
    const id = new mongoose.Types.ObjectId('64eec5d5c616cd2c8a7ab62d');

    jest.spyOn(booksService, 'findById').mockResolvedValue(createdBook as any);

    const result = await booksService.findById(id);
    expect(booksService.findById).toHaveBeenCalledWith(id);
    expect(result).toBe(createdBook);
  });

  it('should return empty beacause not find book by id ', async () => {
    const id = new mongoose.Types.ObjectId('66b95781dc3fb7f79e6bb5b0');

    jest.spyOn(booksService, 'findById').mockResolvedValue(null);

    const result = await booksService.findById(id);
    expect(booksService.findById).toHaveBeenCalledWith(id);
    expect(result).toBe(null);
  });
});
