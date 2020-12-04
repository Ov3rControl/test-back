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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.gaurd';
import { UserRoles } from 'src/auth/user.entity';
import { CreateItemDTO } from './dto/create-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { Item } from './items.entity';
import { ItemsService } from './items.service';
@Controller('items')
@UseGuards(AuthGuard(), RolesGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @Roles(UserRoles.Admin)
  createItem(@Body() createItemDto: CreateItemDTO): Promise<Item> {
    return this.itemsService.createItem(createItemDto);
  }

  @Get()
  @Roles(UserRoles.Admin, UserRoles.User)
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
  @Roles(UserRoles.Admin, UserRoles.User)
  getItemById(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.itemsService.getItemById(id);
  }

  @Delete('/:id')
  @Roles(UserRoles.Admin)
  deleteItemById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.itemsService.deleteItem(id);
  }

  @Patch('/:id')
  @Roles(UserRoles.Admin)
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItem: UpdateItemDTO,
  ): Promise<Item> {
    return this.itemsService.updateItem(id, updateItem);
  }

  @Patch('/:id/bid')
  @Roles(UserRoles.Admin, UserRoles.User)
  bidOnItem(
    @GetUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItem: UpdateItemDTO,
  ): Promise<Item | { action: boolean; message: string }> {
    return this.itemsService.bidOnItem(id, updateItem, user);
  }
}
