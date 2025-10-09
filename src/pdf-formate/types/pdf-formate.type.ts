import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class PdfFormateType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  formatType: string;

  @Field(() => GraphQLJSON, { nullable: true })
  settings?: Record<string, any>;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
