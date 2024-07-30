import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJourneyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  authorId?: string;

  image?: string;
}
