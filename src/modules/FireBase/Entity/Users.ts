import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Users{
  @Column({name:'description', nullable:false})
  description: string[];

}