import { Controller, UseInterceptors } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';

@Controller('platos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatoController {
    constructor(private readonly platoService: PlatoService) {}

}
