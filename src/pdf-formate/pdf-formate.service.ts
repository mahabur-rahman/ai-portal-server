import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfFormate } from './entities/pdf-formate.entity';
import { CreatePdfFormateInput } from './dto/create-pdf-formate.input';
import { UpdatePdfFormateInput } from './dto/update-pdf-formate.input';

@Injectable()
export class PdfFormateService {
  constructor(
    @InjectRepository(PdfFormate)
    private readonly pdfFormateRepository: Repository<PdfFormate>,
  ) {}

  async create(
    createPdfFormateInput: CreatePdfFormateInput,
  ): Promise<PdfFormate> {
    const pdfFormate = this.pdfFormateRepository.create(createPdfFormateInput);
    return await this.pdfFormateRepository.save(pdfFormate);
  }

  async findAll(): Promise<PdfFormate[]> {
    return await this.pdfFormateRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PdfFormate> {
    const pdfFormate = await this.pdfFormateRepository.findOne({
      where: { id },
    });
    if (!pdfFormate) {
      throw new NotFoundException(`PdfFormate with ID ${id} not found`);
    }
    return pdfFormate;
  }

  async update(
    updatePdfFormateInput: UpdatePdfFormateInput,
  ): Promise<PdfFormate> {
    const { id, ...updateData } = updatePdfFormateInput;
    const pdfFormate = await this.findOne(id);
    Object.assign(pdfFormate, updateData);
    return await this.pdfFormateRepository.save(pdfFormate);
  }

  async remove(id: string): Promise<PdfFormate> {
    const pdfFormate = await this.findOne(id);
    await this.pdfFormateRepository.remove(pdfFormate);
    return { ...pdfFormate, id };
  }
}
