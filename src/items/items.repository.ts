import { MailerService } from '@nestjs-modules/mailer/dist';
import { User } from 'src/auth/user.entity';
import { currentUnixTime } from 'src/helper/currentUnixTime';
import { ResMessage } from 'src/helper/responseMessage';
import { EntityRepository, LessThan, Repository } from 'typeorm';
import { CreateItemDTO } from './dto/create-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { Item, ItemStatus } from './items.entity';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  constructor(private readonly mailerService: MailerService) {
    super();
  }
  async createItem(createItemDto: CreateItemDTO) {
    const { name, description, closeDate, imageUrl } = createItemDto;

    const item = new Item();
    item.name = name;
    item.description = description;
    item.closeDate = closeDate;
    item.imageUrl = imageUrl;

    await item.save();
    return item;
  }

  async updateItem(id: number, updateItem: UpdateItemDTO) {
    return this.save({ ...updateItem, id: id });
  }

  async updateBid(id: number, { bid }: UpdateItemDTO, user: User) {
    const item = await this.findOne(id, {
      relations: ['users'],
    });
    const currItemBidders = item.users;
    const { username } = user;

    if (item.status === ItemStatus.CLOSED)
      return ResMessage(false, 'Bidding on this item is closed'); // close betting on this item if it's expired
    if (item.highestBidder === username)
      return ResMessage(false, 'You are the current highest bidder');

    if (item.bid < bid && item.highestBidder !== username) {
      item.bidHistory
        ? (item.bidHistory = [...item.bidHistory, String(bid)])
        : (item.bidHistory = [String(bid)]);
      //*TODO* email service function
      console.log(
        currItemBidders,
        'Send Emails to current bidders on that item',
      );
      currItemBidders.forEach((user) => {
        this.mailerService
        .sendMail({
          to:  user.username+ "@scopic.com",
          from: 'ov3rcontrol@hotmail.com',
          subject: `A New bid on ${item.name}`,
          text: `Current Highest Bidder: ${item.highestBidder}`,
          html: `<b>Hello ${user.username}</b>`,
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      })

      return this.save({
        bid,
        id: id,
        bidHistory: item.bidHistory,
        highestBidder: username,
        users: [...item.users, user],
      });
    }
    return ResMessage(
      false,
      "Can't bind on item with an amount lower than the current",
    );
  }

  async getAllExpiredItems(): Promise<Item[]> {
    return this.find({
      relations: ['users'],
      where: {
        closeDate: LessThan(currentUnixTime),
        status: ItemStatus.OPEN,
      },
      select: ['id', 'highestBidder', 'name'],
    });
  }

  async markItemAsClosed(id: number) {
    this.save({ id, status: ItemStatus.CLOSED });
  }
}
