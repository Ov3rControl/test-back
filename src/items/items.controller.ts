import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateItemDTO } from './dto/create-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { Item } from './items.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createItem(@Body() createItemDto: CreateItemDTO): Promise<Item> {
    return this.itemsService.createItem(createItemDto);
  }

  @Get()
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Item>> {
    limit = limit > 100 ? 100 : limit;
    return this.itemsService.paginate({
      page,
      limit,
      route: 'http://localhost:3000/items',
    });
  }

  @Get('/:id')
  getItemById(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.itemsService.getItemById(id);
  }

  @Delete('/:id')
  deleteItemById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.itemsService.deleteItem(id);
  }

  @Patch('/:id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItem: UpdateItemDTO,
  ): Promise<Item> {
    return this.itemsService.updateItem(id, updateItem);
  }

  @Patch('/:id/bid')
  bidOnItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItem: UpdateItemDTO,
  ): Promise<Item | { action: boolean; message: string }> {
    return this.itemsService.bidOnItem(id, updateItem);
  }
}
