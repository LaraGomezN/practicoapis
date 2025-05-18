import { Controller, UseInterceptors } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
    constructor(private readonly restauranteService: RestauranteService) {}
}
