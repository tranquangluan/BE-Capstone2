import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Projects{
  // @PrimaryGeneratedColumn()
  // id: string;
  @Column({name:'date', nullable:false})
  date: Date;
  @Column({name:'description', nullable:false})
  description: string[];
  @Column({name:'name', nullable:false})
  name: string;

}