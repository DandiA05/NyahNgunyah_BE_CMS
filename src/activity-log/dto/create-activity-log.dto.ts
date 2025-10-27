import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateActivityLogDto {
  @IsNotEmpty()
  @MaxLength(25)
  user_id: number;

  @IsNotEmpty()
  @MaxLength(25)
  activity: string;
}
