import { createMicroservice } from '../../../lib/createMicroservice';
import { PresenceModule }     from './presence.module';
import { StateModule }        from '../../state/src/state.module';

async function bootstrap() {
  const app = await createMicroservice(PresenceModule.forRoot());

  await app.listen(() => {

  });
}

bootstrap();
