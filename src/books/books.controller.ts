import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get('search')
  search(@Query('search') search: string) {
    return this.booksService.search(search);
  }

  @Get('available')
  available(@Query('search') search: string) {
    return this.booksService.available(search);
  }
}
