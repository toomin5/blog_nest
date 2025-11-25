import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreatePostDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}
