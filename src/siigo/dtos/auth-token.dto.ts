import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthTokenDTO {
  @IsString()
  @IsNotEmpty()
  readonly access_token: string;

  @IsNumber()
  @IsNotEmpty()
  readonly expires_in: number;

  @IsString()
  @IsNotEmpty()
  readonly token_type: string;

  @IsString()
  @IsNotEmpty()
  readonly scope: string;
}
