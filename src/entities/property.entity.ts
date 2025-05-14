import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyFeature } from "./propertyFeature.entity";
import { User } from "./user.entity";

@Entity()
export class Property {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    description: string
 
    @Column({ default: 0 })
    price: number

    @OneToOne(() => PropertyFeature, (PropertyFeature) => PropertyFeature.property, {cascade: true})
    propertyFeature: PropertyFeature

    @ManyToMany(()=>User, (user)=> user.properties )
    @JoinColumn()
    user: User

    @ManyToMany(()=> User, (user)=> user.likedProperties)
    likedBy: User[]
}