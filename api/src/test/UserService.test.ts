import {beforeEach, describe, expect, test, vi} from 'vitest';
import { UserService } from '../domains/users/services/UserService';
import { Prisma, User} from '@prisma/client';
import prisma from '../libs/__mocks__/prisma';
import * as bcrypt from 'bcrypt';

vi.mock('../libs/prisma');
vi.mock('bcrypt', () => ({
  hash: vi.fn((password: string, saltRounds: number) => 'encryptedPassword'),
}));

const selectOptions = {
  id: true,
  name: true,
  email: true,
  username: true,
  followed_by: {select:{
    id: true,
    },
  },
  following: {select:{
    id: true,
    },
  },
  picture: {
    where: {
      profile_picture: true,
    },
    select: {
      id: true,
      picture_url: true,
    },
  },
  created_at: true,
};

describe('create', () => {
  let createBody: Prisma.UserCreateInput;
  
  beforeEach(() => {
    vi.restoreAllMocks();
    
    createBody = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      name: 'test',
    }
  });

  test('should call findFirst with email and username', async () => {
    await UserService.create(createBody, null);
    
    expect(prisma.user.findFirst).toHaveBeenNthCalledWith(1, {
      where: {
        email: createBody.email,
      },
    });

    expect(prisma.user.findFirst).toHaveBeenNthCalledWith(2, {
      where: {
        username: createBody.username,
      },
    });
  });

  test('should throw error if email already exists', async () => {
    prisma.user.findFirst.mockResolvedValueOnce({...createBody, id: '1', created_at: new Date('01-01-2023')});

    await expect(UserService.create(createBody, null)).rejects.toThrow('Email already in use');
  });

  test('should throw error if username already exists', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce({...createBody, id: '1', created_at: new Date('01-01-2023')});

    await expect(UserService.create(createBody, null)).rejects.toThrow('Username already in use');
  });

  test('should call encryptPassword', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await UserService.create(createBody, null);

    expect(bcrypt.hash).toHaveBeenCalledWith(createBody.password, 10);
  });

  test('should call create with encrypted password', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await UserService.create(createBody, null);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...createBody,
        password: 'encryptedPassword',
        picture: {
          create: {
            picture_url: 'default.png',
            profile_picture: true,
          },
        }
      },
    });
  });

  test('should call create with file', async () => {
    const file = {
      filename: 'test.png',
    };

    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await UserService.create(createBody, file);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...createBody,
        password: 'encryptedPassword',
        picture: {
          create: {
            picture_url: file.filename,
            profile_picture: true,
          },
        }
      },
    });
  });
});

describe('getAll', () => {
  let findManyUsers: User[];

  beforeEach(() => {
    vi.restoreAllMocks();

    findManyUsers = [
      {
        id: '1',
        name: 'test',
        username: 'test',
        email: 'test@test.com',
        password: 'test',
        created_at: new Date('01-01-2023'),
      },
    ];
  });

  test('should call findMany with select', async () => {
    prisma.user.findMany.mockResolvedValueOnce(findManyUsers);
    
    await UserService.getAll();

    expect(prisma.user.findMany).toHaveBeenCalledWith({ select: selectOptions });
  });

  test('should return users', async () => {
    prisma.user.findMany.mockResolvedValueOnce(findManyUsers);

    const users = await UserService.getAll();

    expect(users).toEqual(findManyUsers);
  });

  test('should throw error if no users found', async () => {
    prisma.user.findMany.mockResolvedValueOnce([]);

    await expect(UserService.getAll()).rejects.toThrow('No users found');
  });
});

describe('getById', () => {
  let findFirstUser: User;

  beforeEach(() => {
    vi.restoreAllMocks();

    findFirstUser = {
      id: '1',
      name: 'test',
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      created_at: new Date('01-01-2023'),
    };
  });

  test('should call findFirst with id and select', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    
    await UserService.getById('1');

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      select: selectOptions,
    });
  });

  test('should return user', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);

    const user = await UserService.getById('1');

    expect(user).toEqual(findFirstUser);
  });

  test('should throw error if user not found', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await expect(UserService.getById('1')).rejects.toThrow('User not found');
  });
});

describe('getByUsername', () => {
  let findFirstUser: User;

  beforeEach(() => {
    vi.restoreAllMocks();

    findFirstUser = {
      id: '1',
      name: 'test',
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      created_at: new Date('01-01-2023'),
    };

  });

  test('should call findFirst with username and select', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    
    await UserService.getByUsername('test');

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        username: 'test',
      },
      select: selectOptions,
    });
  });

  test('should return user', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);

    const user = await UserService.getByUsername('test');

    expect(user).toEqual(findFirstUser);
  });

  test('should throw error if user not found', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await expect(UserService.getByUsername('test')).rejects.toThrow('User not found');
  });
});

describe('edit', () => {
  let findFirstUser: User;
  let editBody: Partial<Omit<User, 'id'>>;
  let file: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    findFirstUser = {
      id: '1',
      name: 'test',
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      created_at: new Date('01-01-2023'),
    };

    editBody = {
      name: 'test2',
      username: 'test2',
      email: 'test@test.com',
      password: 'test',
    };

    file = {
      filename: 'test.png',
    };
  });

  test('should call findFirst with id', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    
    await UserService.edit('1', editBody, null);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  test('should throw error if user not found', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await expect(UserService.edit('1', editBody, null)).rejects.toThrow('User not found');
  });

  test('should call findFirst with email and username', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    
    await UserService.edit('1', editBody, null);

    expect(prisma.user.findFirst).toHaveBeenNthCalledWith(2, {
      where: {
        email: editBody.email,
      },
    });

    expect(prisma.user.findFirst).toHaveBeenNthCalledWith(3, {
      where: {
        username: editBody.username,
      },
    });
  });

  test('should throw error if email already exists', async () => {
    prisma.user.findFirst.mockResolvedValue(findFirstUser);

    await expect(UserService.edit('2', editBody, null)).rejects.toThrow('Email already in use');
  });

  test('should throw error if username already exists', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);

    await expect(UserService.edit('2', editBody, null)).rejects.toThrow('Username already in use');
  });

  test('should call encryptPassword', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await UserService.edit('2', editBody, null);
    expect(bcrypt.hash).toHaveBeenCalledWith('test', 10);
  });

  test('should call update with encrypted password', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await UserService.edit('2', editBody, null);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: '2',
      },
      data: {
        ...editBody,
        password: 'encryptedPassword',
      },
    });
  });

  test('should call update with file', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.picture.findFirst.mockResolvedValueOnce({
      id: '1',
      picture_url: 'test.png',
      profile_picture: true,
      user_id: '2',
      created_at: new Date('01-01-2023'),
    });

    await UserService.edit('2', editBody, file);

    expect(prisma.picture.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        picture_url: file.filename,
      },
    });
  });

  test('should call update', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(findFirstUser);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.picture.findFirst.mockResolvedValueOnce(null);

    await UserService.edit('2', editBody, null);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: '2',
      },
      data: {
        ...editBody,
      },
    });
  });
});

describe('toggleFollow', () => {
  let followingUser: User;
  let followedUser: User;

  beforeEach(() => {
    vi.restoreAllMocks();

    followingUser = {
      id: '1',
      name: 'test',
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      created_at: new Date('01-01-2023'),
    };

    followedUser = {
      id: '2',
      name: 'test2',
      username: 'test2',
      email: 'test2@test.com',
      password: 'test',
      created_at: new Date('01-01-2023'),
    };
  });

  test('should call findFirst with id and select', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(followingUser);
    prisma.user.findFirst.mockResolvedValueOnce(followedUser);
    
    await UserService.toggleFollow('1', '2');

    expect(prisma.user.findFirst).toHaveBeenNthCalledWith(1, {
      where: {
        id: '1',
      },
    });

    expect(prisma.user.findFirst).toHaveBeenNthCalledWith(2, {
      where: {
        id: '2',
      },
    });
  });

  test('should throw error if following user not found', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(followedUser);

    await expect(UserService.toggleFollow('1', '2')).rejects.toThrow('User not found');
  });

  test('should throw error if followed user not found', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(followingUser);
    prisma.user.findFirst.mockResolvedValueOnce(null);

    await expect(UserService.toggleFollow('1', '2')).rejects.toThrow('User not found');
  });

  test('should call findFirst with followingId and followedId', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(followingUser);
    prisma.user.findFirst.mockResolvedValueOnce(followedUser);
    
    await UserService.toggleFollow('1', '2');

    expect(prisma.user.findFirst).toHaveBeenNthCalledWith(3, {
      where: {
        id: followingUser.id,
        following: {
          some: {
            id: followedUser.id,
          },
        },
      },
    });
  });

  test('should disconnect if following', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(followingUser);
    prisma.user.findFirst.mockResolvedValueOnce(followedUser);
    prisma.user.findFirst.mockResolvedValueOnce(followedUser);
    
    await UserService.toggleFollow('1', '2');

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: followingUser.id,
      },
      data: {
        following: {
          disconnect: {
            id: followedUser.id,
          },
        },
      },
    });
  });

  test('should connect if not following', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(followingUser);
    prisma.user.findFirst.mockResolvedValueOnce(followedUser);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    
    await UserService.toggleFollow('1', '2');

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: followingUser.id,
      },
      data: {
        following: {
          connect: {
            id: followedUser.id,
          },
        },
      },
    });
  });

});




