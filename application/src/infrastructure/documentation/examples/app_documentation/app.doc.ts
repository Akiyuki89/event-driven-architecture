import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RecivebackofficePostbackExamples } from '@infrastructure/documentation/examples/app_examples/app.example.doc';

export function HandlePostbackDocumentation() {
  return applyDecorators(
    ApiOperation({ summary: 'Recebe um postback do BackOffice' }),
    ApiQuery({
      name: 'postback',
      description: 'Dados do postback enviados pelo BackOffice',
      type: 'object',
      examples: RecivebackofficePostbackExamples,
    }),
    ApiResponse({
      status: 200,
      description: 'Postback processado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description: 'Ocorreu um erro ao processar o postback.',
    }),
  );
}

