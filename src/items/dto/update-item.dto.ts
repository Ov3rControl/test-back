import { IsNotEmpty, IsString } from 'class-validator';
import { CreateItemDTO } from './create-item.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateItemDTO extends PartialType(CreateItemDTO) {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsString()
  closeDate: number;

  @IsNotEmpty()
  bid: number;
}
