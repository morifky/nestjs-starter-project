import { BaseDto } from '@/base/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class createProductDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;
}
