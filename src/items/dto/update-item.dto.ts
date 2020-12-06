import { IsNotEmpty, IsString } from 'class-validator';
import { CreateItemDTO } from './create-item.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateItemDTO extends PartialType(CreateItemDTO) {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  closeDate: number;

  @ApiProperty()
  @IsNotEmpty()
  bid: number;
}
