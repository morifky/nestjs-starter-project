import { BaseDto as IBaseDto } from '../interfaces/base-dto.interface';

export abstract class BaseDto implements IBaseDto {
  id?: string;
}
