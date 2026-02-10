import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Group} from '../../entities/group.entity';
import {GroupsController} from './groups.controller';
import {GroupsService} from './groups.service';
import {StudentsGroups} from "../../entities/students-group.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Group, StudentsGroups])],
    controllers: [GroupsController],
    providers: [GroupsService],
})
export class GroupsModule {
}