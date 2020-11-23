import { EntityRepository, Repository } from 'typeorm';
import { CreateItemDTO } from './dto/create-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { Item } from './items.entity';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
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

  async updateBid(id: number, { bid }: UpdateItemDTO) {
    const item = await this.findOne(id);

    if (item.bid < bid) {
      item.bidHistory
        ? (item.bidHistory = [...item.bidHistory, String(bid)])
        : (item.bidHistory = [String(bid)]);
      return this.save({ bid, id: id, bidHistory: item.bidHistory });
    }
    return false;
  }
}
