import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PdfFormateService } from './pdf-formate.service';
import { PdfFormateType } from './types';
import { CreatePdfFormateInput } from './dto/create-pdf-formate.input';
import { UpdatePdfFormateInput } from './dto/update-pdf-formate.input';

@Resolver(() => PdfFormateType)
export class PdfFormateResolver {
  constructor(private readonly pdfFormateService: PdfFormateService) {}

  @Mutation(() => PdfFormateType)
  createPdfFormate(
    @Args('createPdfFormateInput') createPdfFormateInput: CreatePdfFormateInput,
  ) {
    return this.pdfFormateService.create(createPdfFormateInput);
  }

  @Query(() => [PdfFormateType], { name: 'pdfFormats' })
  findAllPdfFormats() {
    return this.pdfFormateService.findAll();
  }

  @Query(() => PdfFormateType, { name: 'pdfFormate' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.pdfFormateService.findOne(id);
  }

  @Mutation(() => PdfFormateType)
  updatePdfFormate(
    @Args('updatePdfFormateInput') updatePdfFormateInput: UpdatePdfFormateInput,
  ) {
    return this.pdfFormateService.update(updatePdfFormateInput);
  }

  @Mutation(() => PdfFormateType)
  removePdfFormate(@Args('id', { type: () => String }) id: string) {
    return this.pdfFormateService.remove(id);
  }
}
