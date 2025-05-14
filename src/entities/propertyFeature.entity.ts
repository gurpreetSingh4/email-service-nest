import { BooleanExpression } from "mongoose";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./property.entity";
import { prependOnceListener } from "node:process";

@Entity()
export class PropertyFeature{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    badrooms: number

    @Column()
    bathrooms: number
    
    @Column()
    parkingSpots: number
    
    @Column()
    area: number

    @Column()
    hasBalcony: boolean

    @Column()
    hasGardenYard: boolean

    @Column()
    hasSwimmingPool: boolean

    @OneToOne(()=> Property, (Property)=> Property.propertyFeature)
    @JoinColumn()
    property: Property


}