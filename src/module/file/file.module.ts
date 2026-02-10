import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FileEntity} from '../../entities/file.entity';
import {Submission} from '../../entities/submission.entity';
import {FilesController} from './file.controller';
import {FilesService} from './file.service';

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity, Submission])],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}
