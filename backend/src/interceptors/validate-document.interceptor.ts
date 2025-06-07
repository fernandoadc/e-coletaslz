import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {validaDocumento} from '../utils/validate-document';
import {HttpErrors} from '@loopback/rest';

@injectable({tags: {key: ValidateDocumentInterceptor.BINDING_KEY}})
export class ValidateDocumentInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ValidateDocumentInterceptor.name}`;

  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      if (invocationCtx.methodName === 'create') {
        const data = invocationCtx.args[0];
        const doc = data?.documentValue;
        const cnh = data?.license;
        if (!doc || !validaDocumento(doc) || (cnh && !validaDocumento(cnh))) {
          throw new HttpErrors.UnprocessableEntity(
            'Documento inválido (CPF, CNPJ ou CNH).',
          );
        }
        const result = await next();
        return result;
      }
    } catch (err) {
      throw err;
    }
  }
}
