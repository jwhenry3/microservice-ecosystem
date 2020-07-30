import { createMicroservice }             from '../../../lib/createMicroservice';

async function bootstrap() {
  const app = await createMicroservice();

  await app.listen(() => {

  });
}

bootstrap();
