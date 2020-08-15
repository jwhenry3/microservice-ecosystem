import { createMicroservice } from '../../../lib/createMicroservice';
import { WorldModule }        from './world.module';

async function bootstrap() {
  const app = await createMicroservice(WorldModule);

  await app.listen(() => {

  });
}

bootstrap();
