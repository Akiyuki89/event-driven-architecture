import { Controller, Logger, HttpCode, HttpStatus, Param, Query, Body, Get, Post, Put, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserCommand, UpdateUserCommand, DeleteUserCommand } from '@application/commands/export-all.commands';
import { ReadUserByIdQuery, ReadUserByEmailQuery, ReadAllUsersQuery } from '@application/queries/export-all.queries';
import { UserMapper } from '@domain/mappers/user.mapper';
import { CreateUserDto, UpdateUserDto } from '@shared/dtos/export-all.dtos';

@ApiTags('Users')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create-user')
  @HttpCode(HttpStatus.ACCEPTED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Receiving request to create user: ${JSON.stringify(createUserDto)}`);

    const createUserCommand = new CreateUserCommand({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role,
      verified: false,
    });

    this.logger.log(`Executing CreateUserCommand for user: ${createUserDto.email}`);

    const result = await this.commandBus.execute(createUserCommand);

    this.logger.log(`User creation command executed successfully!`);

    return UserMapper.toResponse(result);
  }

  @Get('/id/:id')
  @HttpCode(HttpStatus.OK)
  async readUserById(@Param('id') userId: string) {
    this.logger.log(`Fetching user by ID: ${userId}`);

    const user = await this.queryBus.execute(new ReadUserByIdQuery(userId));

    this.logger.log(`User found by ID: ${userId}`);

    return UserMapper.toResponse(user);
  }

  @Get('/email/:email')
  @HttpCode(HttpStatus.OK)
  async readUserByEmail(@Param('email') email: string) {
    this.logger.log(`Fetching user by email: ${email}`);

    const user = await this.queryBus.execute(new ReadUserByEmailQuery(email));

    this.logger.log(`User found by email: ${email}`);

    return UserMapper.toResponse(user);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async readAll(@Query('page') page: number, @Query('pageSize') pageSize?: number) {
    this.logger.log(`Fetching all users - Page: ${page}, PageSize: ${pageSize ?? 1000}`);

    const users = await this.queryBus.execute(new ReadAllUsersQuery(Number(page), Number(pageSize)));

    this.logger.log(`Fetched ${users.length} users.`);

    return users.map(UserMapper.toResponse);
  }

  @Put('/update-user/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Receiving request to update user with ID: ${userId}`);

    const updateUserCommand = new UpdateUserCommand(userId, updateUserDto.name, updateUserDto.email, updateUserDto.password, updateUserDto.role, updateUserDto.verified);

    const result = await this.commandBus.execute(updateUserCommand);

    this.logger.log(`User update command executed successfully!`);

    return UserMapper.toResponse(result);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userId: string) {
    this.logger.log(`Receiving request to delete user with ID: ${userId}`);

    await this.commandBus.execute(new DeleteUserCommand(userId));

    this.logger.log(`User delete command executed successfully!`);
  }
}
