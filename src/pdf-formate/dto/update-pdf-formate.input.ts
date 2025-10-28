import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreatePdfFormateInput } from './create-pdf-formate.input';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdatePdfFormateInput extends PartialType(CreatePdfFormateInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
