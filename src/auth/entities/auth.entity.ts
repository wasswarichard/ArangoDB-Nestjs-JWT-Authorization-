import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  @ApiProperty()
  clientId: string | null;

  @ApiProperty()
  username: string;

  @ApiProperty()
  platformRoleIds: string[];

  @ApiProperty()
  permissions: string[];
}
