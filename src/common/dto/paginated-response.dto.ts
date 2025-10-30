// src/common/dto/paginated-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  @Type(() => Array<T>)
  data: T[];
}