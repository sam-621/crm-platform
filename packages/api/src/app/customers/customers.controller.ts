import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpCode
} from '@nestjs/common';
import { CustomersService } from './customers.service';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { FindOneCustomerParams } from './params/find-one-customer.params';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post()
  @HttpCode(201)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() payload: CreateCustomerDto,
    @Res() res: Response
  ): Promise<Response> {
    const data = await this.service.create(user.id, payload);

    return res.json({ response: 'success', data });
  }

  @Get()
  @HttpCode(200)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Res() res: Response
  ): Promise<Response> {
    const { id } = user;
    const data = await this.service.findAll(id);

    return res.json({ response: 'success', data });
  }

  @Get(':id')
  @HttpCode(200)
  findOne(
    @CurrentUser() user: JwtPayload,
    @Param() params: FindOneCustomerParams
  ) {
    return this.service.findOne(user.id, params.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.service.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
