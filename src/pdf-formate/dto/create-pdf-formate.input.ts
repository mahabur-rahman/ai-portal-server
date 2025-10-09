import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreatePdfFormateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  formatType: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
