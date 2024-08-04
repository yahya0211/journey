import { PartialType } from '@nestjs/mapped-types';
import { CreateJourneyDto } from './create-journey.dto';
import { IsString } from 'class-validator';

export class UpdateJourneyDto extends PartialType(CreateJourneyDto) {
  @IsString()
  title?: string | undefined;

  @IsString()
  content?: string | undefined;

  image?: string | undefined;
}
