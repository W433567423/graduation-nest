import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsEntity } from './entities/project.entity';
import { REQUEST } from '@nestjs/core';
import { IReqUser } from '..';
import { UsersEntity } from '../users/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProjectsService {
  constructor(
    @Inject(REQUEST) private readonly requset: IReqUser,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(ProjectsEntity)
    private readonly projectRepository: Repository<ProjectsEntity>,
  ) {}
  // 创建项目
  async create(projectName: string) {
    const user = await this.getUser();

    await this.isExistProject(projectName, user);

    const projct = new ProjectsEntity();
    projct.projectName = projectName;
    projct.user = user;
    this.projectRepository.save(projct);
  }
  // 获取项目列表
  async getList(page: number | undefined, size: number | undefined) {
    const user = await this.getUser();
    if (page === undefined && size === undefined) {
      return this.projectRepository.findAndCountBy({ user });
    } else {
      return this.projectRepository.findAndCount({
        skip: page,
        take: size,
        where: { user },
      });
    }
  }

  // 重命名项目
  async reName(projectId: number, newName: string) {
    const user = await this.getUser();

    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      user,
    });
    if (dbProject) {
      await this.isExistProject(newName, user);
      this.projectRepository.update(dbProject.id, { projectName: newName });
    } else {
      throw new HttpException('未找到该项目', HttpStatus.NO_CONTENT);
    }
  }

  // 删除项目
  async deleteByIds(ids: number[]) {
    const user = await this.getUser();
    const qb = this.projectRepository.createQueryBuilder('project');
    const projects = await qb
      .where('project.userId = :userId', { userId: user.id })
      .andWhere('project.id IN (:ids)', { ids })
      .getMany();

    return await this.projectRepository.remove(projects);
  }

  // 判断项目名是否被使用
  async isExistProject(projectName: string, user: UsersEntity) {
    const dbProject = await this.projectRepository.findOneBy({
      projectName,
      user,
    });
    if (dbProject) {
      throw new HttpException('该项目名已被使用', HttpStatus.FORBIDDEN);
    }
  }

  // 设置运行状态
  async setProjectDisable(projectId: number, status: boolean) {
    const user = await this.getUser();
    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      user,
    });
    if (dbProject) {
      this.projectRepository.update(projectId, { disable: status });
    } else {
      throw new HttpException('禁止修改他人项目!', HttpStatus.FORBIDDEN);
    }
  }

  // 设置运行状态
  async setProjectStatus(user: UsersEntity, projectId: number, status: number) {
    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      user,
    });
    if (dbProject) {
      this.projectRepository.update(projectId, { lastStatus: status });
    } else {
      throw new HttpException('禁止修改他人项目!', HttpStatus.FORBIDDEN);
    }
  }

  // 获取用户
  async getUser() {
    const user = await this.userRepository.findOneBy({
      id: this.requset.user?.id,
    });
    if (!user) {
      // 理论上不可能
      throw new HttpException('该用户名不存在', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
