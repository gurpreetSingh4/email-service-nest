import { NotFoundException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePropertyDto } from "src/dto/createProperty.dto";
import { UpdatePropertyDto } from "src/dto/updateProperty.dto";
import { Property } from "src/entities/property.entity";
import { Repository } from "typeorm";

@Injectable()
export class DemoService {
    constructor(@InjectRepository(Property) private propertyRepo: Repository<Property>) { }

    async findOne(id: number) {
        const property = await this.propertyRepo.findOne({
            where: {
                id,
            }
        })
        if (!property) {
            throw new NotFoundException()
        }
        return Property
    }

    async findAll() {
        return await this.propertyRepo.find()
    }
    async create(dto: CreatePropertyDto) {
        return await this.propertyRepo.save(dto)
    }
    async update(id: number, dto: UpdatePropertyDto) {
        return await this.propertyRepo.update({id}, dto)
     }
    async delete() { }

}