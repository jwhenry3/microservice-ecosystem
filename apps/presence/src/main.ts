import { createMicroservice } from '../../../lib/createMicroservice';
import { PresenceModule } from './presence.module';
import { BattleModule }   from '../../battle/src/battle.module';

async function bootstrap() {
  const app = await createMicroservice(PresenceModule.forRoot());

  await app.listen(() => {

  });
}

bootstrap();
