import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { Users } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { createMockData, updateMockData, usersMockData } from './mock-data';

const mockUserRepository = {
  create: jest.fn().mockImplementation((dto: CreateUserDto) => dto),
  save: jest.fn().mockResolvedValue(usersMockData),
  find: jest.fn(),
  findOne: jest.fn((id) => (id === 1 ? createMockData : null)),
  update: jest
    .fn()
    .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} }),
  remove: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<Users>;

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
    jest.spyOn(repository, 'save').mockResolvedValue(usersMockData[0]);

    const user = await service.createUser(createMockData);
    expect(user).toEqual(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
      }),
    );
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
      }),
    );
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
      }),
    );
  });

  it('should return all users', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue(usersMockData);

    const result = await service.findAllUser();

    expect(result.data).toEqual(usersMockData);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should return a user if found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(usersMockData[0]);

    const result = await service.findOneUser(usersMockData[0].uuid);

    expect(result.data).toEqual(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
      }),
    );
    expect(mockUserRepository.findOne).toHaveBeenCalled();
  });

  it('should throw an error if user not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(service.findOneUser('non-existent-uuid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update and return the updated user', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(usersMockData[0]);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...usersMockData[0],
    });

    const result = await service.updateUser('1', updateMockData);

    expect(result.data).toEqual(expect.objectContaining(updateMockData));
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { uuid: '1' },
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith({
      ...usersMockData[0],
      firstName: 'Test',
    });
  });

  it('should remove an existing user', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(usersMockData[0]);
    await expect(service.removeUser('1')).resolves.toBeTruthy();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { uuid: '1' },
    });
    expect(mockUserRepository.remove).toHaveBeenCalled();
  });
});
