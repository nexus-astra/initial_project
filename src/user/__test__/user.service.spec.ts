import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository, UpdateResult } from 'typeorm';
import { Users } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { createMockData, updateMockData } from './mock-data';
import { v4 as uuidv4 } from 'uuid';

const mockUserRepository = {
  create: jest.fn().mockReturnValue(createMockData),
  save: jest.fn().mockResolvedValue(createMockData),
  find: jest.fn(),
  findOne: jest.fn((id) => (id === 1 ? createMockData : null)),
  update: jest
    .fn()
    .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} }),
  remove: jest.fn(),
};

describe('UserService', () => {
  interface User {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  let service: UserService;
  let repository: Repository<Users>;
  let userData: User = {
    uuid: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return a new user', async () => {
    userData = await service.createUser(createMockData);
    expect(userData).toEqual(createMockData);
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith(createMockData);
  });

  it('should return all user roles', async () => {
    const entities = [{ ...createMockData, uuid: uuidv4() }];
    jest.spyOn(repository, 'find').mockResolvedValue(entities);

    const result = await service.findAllUser();

    expect(result.data).toEqual(entities);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should return a user if found', async () => {
    const entities = { ...createMockData, uuid: userData.uuid };
    jest.spyOn(repository, 'findOne').mockResolvedValue(entities);

    const result = await service.findOneUser(userData.uuid);

    expect(result.data).toEqual(entities);
    expect(mockUserRepository.findOne).toHaveBeenCalled();
  });

  //   it('should throw an error if user not found', async () => {
  //     jest.spyOn(repository, 'findOne').mockResolvedValue(entities);
  //     const result = await service.findOneUser('1');
  //     expect(result).rejects.toThrow(HttpException);
  //   });

  it('should update and return the updated user', async () => {
    const entities = { ...createMockData, uuid: userData.uuid };
    jest
      .spyOn(repository, 'update')
      .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });
    const result = await service.updateUser(userData.uuid, updateMockData);
    expect(result).toEqual({ affected: userData.uuid });
    expect(repository.update).toHaveBeenCalledWith(
      userData.uuid,
      updateMockData,
    );
  });

  it('should call delete method', async () => {
    await service.removeUser(uuidv4());
    expect(repository.delete).toHaveBeenCalled();
  });
});
