import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
// import * as fs from 'fs';
import * as path from 'path';
import { dereferenceDoc } from './utils/swagger-parser';

export const initSwagger = async (app: INestApplication) => {
  const filePath = path.join(__dirname, '../docs/index.yaml');
  const document = (await dereferenceDoc(filePath)) as OpenAPIObject;

  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: {
      deepLinking: true,
      displayOperationId: true,
      defaultModelRendering: 'model',
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        activate: true,
        theme: 'arta',
      },
      tryItOutEnabled: false,
    },
  } as SwaggerCustomOptions);
  // fs.writeFileSync('./swagger-docs.json', JSON.stringify(document, null, 2));
};
