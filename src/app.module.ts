import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from './module/auth/auth.module';
import {GroupsModule} from './module/groups/groups.module';
import {LessonsModule} from './module/lessons/lessons.module';
import {TasksModule} from './module/tasks/tasks.module';
import {SubmissionsModule} from './module/submissions/submissions.module';
import {TemplatesModule} from './module/templates/templates.module';
import {FilesModule} from './module/file/file.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DB_URL,
            autoLoadEntities: true,
            synchronize: false,
        }),
        AuthModule,
        GroupsModule,
        LessonsModule,
        TasksModule,
        SubmissionsModule,
        TemplatesModule,
        FilesModule,
    ],
})
export class AppModule {}
