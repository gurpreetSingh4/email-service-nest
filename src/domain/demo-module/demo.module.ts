import { Module } from "@nestjs/common";
import { DemoService } from "./demo.service";
import { TypeOrmModule} from "@nestjs/typeorm"
import { Property } from "src/entities/property.entity";
@Module({
    imports: [TypeOrmModule.forFeature([
        Property
    ])],
    providers:[DemoService],
    exports: [DemoService]
})
export class DemoModule {

}