import { createMicroservice } from '../../../lib/createMicroservice';
import { AuthModule }         from './auth.module';
import { StateModule }        from '../../state/src/state.module';

async function bootstrap() {
  const app = await createMicroservice(AuthModule.forRoot());

  await app.listen(() => {

  });
}

bootstrap();
