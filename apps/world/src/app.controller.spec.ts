import { Test, TestingModule } from '@nestjs/testing';
import { WorldController } from './world.controller';
import { WorldService }    from './world.service';

describe('AppController', () => {
  let appController: WorldController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorldController],
      providers: [WorldService],
    }).compile();

    appController = app.get<WorldController>(WorldController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
