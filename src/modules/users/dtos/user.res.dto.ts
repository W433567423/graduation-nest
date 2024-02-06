import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { successResDto } from '@/modules/api-dtos/app.res.dto';

export class userRegistryAndLoginResDto extends successResDto<string> {
  @ApiProperty({
    description: 'token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsInVzZXJuYW1lIjoidGVzdDExIiwiaWF0IjoxNzA2NzU0NTc3LCJleHAiOjE3MDY4NDA5Nzd9.nsg7YP1pg5lZztEPZIBuDf137ANfF_q42qTUclXLrCI',
  })
  @IsNotEmpty({ message: 'token不能为空' })
  readonly data: string;
}