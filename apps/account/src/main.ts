import { createMicroservice } from '../../../lib/createMicroservice';
import { AccountModule }      from './account.module';

async function bootstrap() {
  const app = await createMicroservice(AccountModule.forRoot());

  await app.listen(() => {

  });
}

bootstrap();
