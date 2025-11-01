import { PartialType } from '@nestjs/swagger';
import { CreateComercianteDto } from './create-comerciante.dto';

export class UpdateComercianteDto extends PartialType(CreateComercianteDto) {}
