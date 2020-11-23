import { IsString } from 'class-validator';

export class CreateItemDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsString()
  closeDate: number;
}
