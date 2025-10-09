import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfFormateService } from './pdf-formate.service';
import { PdfFormateResolver } from './pdf-formate.resolver';
import { PdfFormate } from './entities/pdf-formate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PdfFormate])],
  providers: [PdfFormateResolver, PdfFormateService],
  exports: [PdfFormateService],
})
export class PdfFormateModule {}
