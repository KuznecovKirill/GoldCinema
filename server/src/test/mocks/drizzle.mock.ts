import { DrizzleService } from "@/database/drizzle.service";

export const mockDb = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([]),
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  $dynamic: jest.fn().mockReturnThis(),
};

export const MockDrizzleService = {
  provide: DrizzleService,
  useValue: { db: mockDb },
};