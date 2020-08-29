import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class LocationEntity {
  @PrimaryColumn()
  characterId: number;
  @Column()
  accountId: number;
  @Column()
  map: string;
  @Column()
  online: boolean;

  @Column()
  x: number;
  @Column()
  y: number;
}
