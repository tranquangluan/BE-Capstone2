import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Users{
  // @PrimaryGeneratedColumn()
  // id: string;
  @Column({name:'description', nullable:false})
  description: string[];

}