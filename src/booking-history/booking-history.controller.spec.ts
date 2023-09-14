import { Test, TestingModule } from '@nestjs/testing';
import { BookingHistoryController } from './booking-history.controller';

describe('BookingHistoryController', () => {
  let controller: BookingHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingHistoryController],
    }).compile();

    controller = module.get<BookingHistoryController>(BookingHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
