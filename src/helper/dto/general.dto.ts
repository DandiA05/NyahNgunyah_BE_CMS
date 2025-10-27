import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetTableDto {
  @IsOptional()
  sortBy?: string;

  @IsOptional()
  orderBy?: SortType;

  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  term?: string;

  @IsOptional()
  tags?: string;
}
