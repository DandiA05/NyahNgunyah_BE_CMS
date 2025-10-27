// src/user/user.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Res,
  Query,
  UseGuards,
  Request,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GetTableDto } from 'src/helper/dto/general.dto';
import { Response } from 'express';
import { ChangePasswordUserDto } from './dto/change-password.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: GetTableDto, @Res() res: Response) {
    const data = await this.userService.findAll(query);
    const result = {
      statusCode: 200,
      message: 'Success',
      data,
    };
    res.status(200).send(result);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<User | undefined> {
    return this.userService.findById(id);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Get(':id')
  async findUserById(@Param('id') id: number): Promise<User | undefined> {
    return this.userService.findUserById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() pegawai: User): Promise<User> {
    return this.userService.update(id, pegawai);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    const result = await this.userService.delete(id);
    if (result) {
      return `Pegawai with ID ${id} deleted successfully`;
    } else {
      return `Pegawai with ID ${id} not found`;
    }
  }
  @UseGuards(AuthGuard)
  @Post('/change-password/:id')
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordUserDto,
  ): Promise<void> {
    return this.userService.changePassword(id, changePasswordDto);
  }
}
