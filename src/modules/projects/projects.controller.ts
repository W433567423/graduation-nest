import { Controller, Patch, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import {
  createProjectReqDto,
  reNameProjectReqDto,
} from './dto/project.req.dto';

@ApiTags('项目管理')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: '创建项目' })
  @Post('create')
  async create(@Body() data: createProjectReqDto) {
    await this.projectsService.create(data.projectName);

    return '项目创建成功';
  }

  @ApiOperation({ summary: '重命名项目' })
  @Patch('rename')
  async auth(@Body() data: reNameProjectReqDto) {
    await this.projectsService.reName(data.projectName, data.newName);

    return '项目重命名成功';
  }
}
