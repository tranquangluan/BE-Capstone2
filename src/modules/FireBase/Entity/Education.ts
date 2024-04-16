import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Education{
  // @PrimaryGeneratedColumn()
  // id: string;
  @Column({name:'date', nullable:false})
  date: Date;
  @Column({name:'degree', nullable:false})
  degree: string;
  @Column({name:'description', nullable:false})
  description: string[];
  @Column({name:'gpa', nullable:false})
  gpa: Double;
  @Column({name:'school', nullable:false})
  school: string;

}