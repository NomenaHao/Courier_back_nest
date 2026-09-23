import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  latitude?: number | null;

  @IsOptional()
  longitude?: number | null;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @IsIn(['livraison', 'recuperation'])
  order_type: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  pickup_location?: LocationDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  delivery_location?: LocationDto | null;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  deliverer_id?: number;
}

export class AssignDelivererDto {
  @IsInt()
  deliverer_id: number;
}
