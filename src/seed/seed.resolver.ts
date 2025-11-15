import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, {
    description: 'Ejecuta el seed para rellenar la base de datos con datos de prueba',
  })
  async executeSeed(): Promise<boolean> {
    return await this.seedService.executeSeed();
  }

  @Mutation(() => Boolean, {
    description: 'Elimina todos los datos de la base de datos',
  })
  async deleteDatabase(): Promise<boolean> {
    return await this.seedService.deleteDatabase();
  }
}
