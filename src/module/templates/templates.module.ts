import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TaskCategory} from '../../entities/task-category.entity';
import {TaskTemplate} from '../../entities/task-template.entity';
import {TemplatesController} from './templates.controller';
import {TemplatesService} from './templates.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskCategory, TaskTemplate])],
    controllers: [TemplatesController],
    providers: [TemplatesService],
})
export class TemplatesModule {
}