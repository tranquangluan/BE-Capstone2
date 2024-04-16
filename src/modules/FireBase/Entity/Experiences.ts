import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Experiences{
  // @PrimaryGeneratedColumn()
  // id: string;
  @Column({name:'date', nullable:false})
  date: Date;
  @Column({name:'company', nullable:true})
  company: string;
  @Column({name:'description', nullable:false})
  description: string[];
  @Column({name:'jobTitle', nullable:false})
  jobTitle: string;

}