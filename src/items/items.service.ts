import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDTO } from './dto/create-item.dto';
import { Item } from './items.entity';
import { ItemRepository } from './items.repository';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { UpdateItemDTO } from './dto/update-item.dto';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';

@Injectable()
export class ItemsService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(ItemRepository) private itemRepo: ItemRepository,
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}

  onModuleInit() {
    this.doActionsWhenItemsCloseDateExpire();
  }
  async paginate(options: IPaginationOptions): Promise<Pagination<Item>> {
    return paginate<Item>(this.itemRepo, options);
  }

  async createItem(createItemDto: CreateItemDTO): Promise<Item> {
    return this.itemRepo.createItem(createItemDto);
  }

  async deleteItem(id: number): Promise<any> {
    const result = await this.itemRepo.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`Item with id:${id} is not found!`);

    return result;
  }

  async getItemById(id: number): Promise<Item> {
    const found = await this.itemRepo.findOne(id);

    if (!found) {
      throw new NotFoundException(`Item with id:${id} is not found!`);
    }

    return found;
  }

  async updateItem(id: number, updateItem: UpdateItemDTO): Promise<Item> {
    return this.itemRepo.updateItem(id, updateItem);
  }

  async bidOnItem(
    id: number,
    bidItem: UpdateItemDTO,
    user: User,
  ): Promise<Item | { action: boolean; message: string }> {
    return await this.itemRepo.updateBid(id, bidItem, user);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async doActionsWhenItemsCloseDateExpire() {

    const closedItems = await this.itemRepo.getAllExpiredItems();
    closedItems.forEach(item => {
      //*TODO* email service function
      item.users.forEach((user) => {
        const email = user.username + "@scopic.com"
        this
        .mailerService
        .sendMail({
          to: email, 
          from: 'ov3rcontrol@hotmail.com',
          subject: `Bidding on ${item.name}`, 
          text: `Bidding Winner ${item.highestBidder}`, 
          html: `<b>Hello ${user.username}</b>`, 
        })
        .then((res) => {console.log(res)})
        .catch((err) => {console.log(err)});
      })
      this.itemRepo.markItemAsClosed(item.id);
    });
  }

  async getUserItems(id: number) {
    return await this.userRepo.findOne(id, {
      relations: ['items'],
      select: ['username', 'id'],
    });
  }
}
