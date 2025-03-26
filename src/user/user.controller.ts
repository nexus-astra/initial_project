import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Users } from './user.entity';

@Controller('users')
@ApiTags('Users') // Group APIs under "Users"
@ApiBearerAuth() // Enables JWT token in Swagger UI
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of users',
    type: [Users],
  })
  async findAll() {
    return await this.userService.findAllUser();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get one user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' }) // Describe parameter
  @ApiResponse({ status: 200, description: 'User found', type: Users })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update one user by ID' })
  @ApiBody({ type: Users }) // Describe request body
  @ApiResponse({
    status: 200,
    description: 'Returns user updated data',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete one user by ID' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  async remove(@Param('id') id: string) {
    return await this.userService.removeUser(id);
  }
}
