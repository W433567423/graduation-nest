import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { AvatarsEntity } from './entities/avatar.entity';
import { WorkSpaceEntity } from './entities/workSpace.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvatarsEntity, WorkSpaceEntity]),
    UserModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [TypeOrmModule],
})
export class FileModule {}
