import { Module } from '@nestjs/common';

import { SiigoController } from './siigo.controller';
import { HttpClientService } from './services/http-client.service';
import { SiigoService } from './services/siigo.service';

@Module({
  providers: [SiigoService, HttpClientService],
  controllers: [SiigoController]
})
export class SiigoModule {}
