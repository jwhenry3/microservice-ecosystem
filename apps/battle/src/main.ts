import { createMicroservice } from '../../../lib/createMicroservice';
import { BattleModule }       from './battle.module';

async function bootstrap() {
  const app = await createMicroservice(BattleModule.forRoot());

  await app.listen(() => {

  });
}

bootstrap();
