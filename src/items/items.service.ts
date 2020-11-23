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
import { UpdateItemDTO } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemRepository) private itemRepo: ItemRepository,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Item>> {
    return paginate<Item>(this.itemRepo, options);
  }

  async createItem(createItemDto: CreateItemDTO): Promise<Item> {
    return this.itemRepo.createItem(createItemDto);
  }

  async bidOnItem(
    id: number,
    bidItem: UpdateItemDTO,
  ): Promise<Item | { action: boolean; message: string }> {
    const result = await this.itemRepo.updateBid(id, bidItem);
    if (result) {
      return result;
    } else {
      return {
        action: false,
        message: "Can't bid with amount lower than the current",
      };
    }
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
}
