import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Skills{
  // @PrimaryGeneratedColumn()
  // id: string;
  @Column({name:'description', nullable:false})
  description: string[];

}