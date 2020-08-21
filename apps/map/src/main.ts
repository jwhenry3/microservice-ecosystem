import { createMicroservice } from '../../../lib/createMicroservice';
import { MapModule }          from './map.module';

async function bootstrap() {
  const app = await createMicroservice(MapModule.forRoot());

  await app.listen(() => {

  });
}

bootstrap();
