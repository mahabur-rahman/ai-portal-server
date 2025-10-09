import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

@InputType()
export class CreatePdfFormateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  location: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
