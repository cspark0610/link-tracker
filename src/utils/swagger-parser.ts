import * as SwaggerParser from '@apidevtools/swagger-parser';

/**
 * @see https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback
 */
export async function dereferenceDoc(file: string) {
  try {
    return await SwaggerParser.dereference(file);
  } catch (error) {
    console.error(error);
  }
}
