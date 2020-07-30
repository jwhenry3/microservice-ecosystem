import { createMicroservice } from '../../../lib/createMicroservice';
import { StateModule }        from './state.module';

async function bootstrap() {
  const app = await createMicroservice(StateModule.forRoot());

  await app.listen(() => {

  });
}

bootstrap();
