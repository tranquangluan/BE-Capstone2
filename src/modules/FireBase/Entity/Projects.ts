import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Projects{
  // @PrimaryGeneratedColumn()
  // id: string;
  @Column({name:'date', nullable:false})
  date: string;
  @Column({name:'description', nullable:false})
  descriptions: string[];
  @Column({name:'project', nullable:false})
  project: string;
  @Column({name:'uid', nullable:false})
  uid: string;
}