import {
  Body,
  Controller,
  Delete,
  Get,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import SseStream from 'ssestream';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.gaurd';
import { User, UserRoles } from 'src/auth/user.entity';
import { CreateItemDTO } from './dto/create-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { Item } from './items.entity';
import { ItemsService } from './items.service';
@Controller('items')
export class ItemsController implements OnModuleInit {
  constructor(private readonly itemsService: ItemsService) {}
  private sse: SseStream;

  onModuleInit() {
    this.sse = new SseStream();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Post()
  @UsePipes(ValidationPipe)
  @Roles(UserRoles.Admin)
  createItem(@Body() createItemDto: CreateItemDTO): Promise<Item> {
    return this.itemsService.createItem(createItemDto);
  }

  @UseGuards(AuthGuard(), RolesGuard)
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
  @UseGuards(AuthGuard(), RolesGuard)
  @Get('/:id')
  @Roles(UserRoles.Admin, UserRoles.User)
  getItemById(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.itemsService.getItemById(id);
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete('/:id')
  @Roles(UserRoles.Admin)
  deleteItemById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.itemsService.deleteItem(id);
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('/:id')
  @Roles(UserRoles.Admin)
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItem: UpdateItemDTO,
  ): Promise<Item> {
    return this.itemsService.updateItem(id, updateItem);
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('/:id/bid')
  @Roles(UserRoles.Admin, UserRoles.User)
  async bidOnItem(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItem: UpdateItemDTO,
  ): Promise<Item | { action: boolean; message: string }> {
    const item = await this.itemsService.bidOnItem(id, updateItem, user);
    this.sse.emit('message', item);
    return item;
  }
  @UseGuards(AuthGuard(), RolesGuard)
  @Get('/user/myitems')
  @Roles(UserRoles.User)
  getUserItems(@GetUser() user: User): Promise<User> {
    return this.itemsService.getUserItems(user.id);
  }

  // @ApiTags('users - series')
  @Get('/sse/item')
  async eventStreamer(@Res() res) {
    this.sse.pipe(res);
    this.sse.on('message', data => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      res.flushHeaders();
    });
  }
}
