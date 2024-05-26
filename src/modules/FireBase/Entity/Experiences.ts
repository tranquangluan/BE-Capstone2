import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Experiences{
  @Column({name:'date', nullable:false})
  date: string;
  @Column({name:'company', nullable:true})
  company: string;
  @Column({name:'description', nullable:false})
  descriptions: string[];
  @Column({name:'jobTitle', nullable:false})
  jobTitle: string;
  @Column({name:'uid', nullable:false})
  uid: string;
}