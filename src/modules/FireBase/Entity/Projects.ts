import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Projects{
  @Column({name:'date', nullable:false})
  date: string;
  @Column({name:'descriptions', nullable:false})
  descriptions: string[];
  @Column({name:'project', nullable:false})
  project: string;
  @Column({name:'uid', nullable:false})
  uid: string;
}