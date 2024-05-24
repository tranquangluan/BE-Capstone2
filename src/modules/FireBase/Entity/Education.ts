import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Education{
  // @PrimaryGeneratedColumn()
  // id: string;
  @Column({name:'date', nullable:false})
  date: string;
  @Column({name:'degree', nullable:false})
  degree: string;
  @Column({name:'gpa', nullable:false})
  gpa: string;
  @Column({name:'school', nullable:false})
  school: string;
  @Column({name:'descriptions', nullable:false})
  descriptions: string[];
  @Column({name:'uid', nullable:false})
  uid: string;
}