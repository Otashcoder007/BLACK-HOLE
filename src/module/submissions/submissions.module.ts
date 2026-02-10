import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Submission} from '../../entities/submission.entity';
import {SubmissionsController} from './submissions.controller';
import {SubmissionsService} from './submissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Submission])],
    controllers: [SubmissionsController],
    providers: [SubmissionsService],
})
export class SubmissionsModule {
}