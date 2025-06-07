export function validaCPF(cpf: string): boolean {
  const cleanedCPF: string = cpf.replace(/[^\d]+/g, '');

  if (cleanedCPF === '' || cleanedCPF.length !== 11) return false;

  const invalidCPFs: string[] = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];

  if (invalidCPFs.includes(cleanedCPF)) return false;

  let sum: number = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
  }

  let remainder: number = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cleanedCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
  }

  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cleanedCPF.charAt(10))) return false;

  return true;
}

// Regex para validação de string no formato CNPJ
export const regexCNPJ: RegExp = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export function validaCNPJ(value: string | number | number[] = ''): boolean {
  if (!value) return false;

  const isString: boolean = typeof value === 'string';
  const validTypes: boolean =
    isString || Number.isInteger(value) || Array.isArray(value);

  if (!validTypes) return false;

  if (isString) {
    const digitsOnly: boolean = /^\d{14}$/.test(value as string);
    const validFormat: boolean = regexCNPJ.test(value as string);
    const isValid: boolean = digitsOnly || validFormat;
    if (!isValid) return false;
  }

  const numbers: number[] = matchNumbers(value);
  if (numbers.length !== 14) return false;

  const items: number[] = [...new Set(numbers)];
  if (items.length === 1) return false;

  const digits: number[] = numbers.slice(12);
  const digit0: number = validCalc(12, numbers);
  if (digit0 !== digits[0]) return false;

  const digit1: number = validCalc(13, numbers);
  return digit1 === digits[1];
}

export function formatCNPJ(value: string | number | number[] = ''): string {
  const valid: boolean = validaCNPJ(value);
  if (!valid) return '';

  const numbers: number[] = matchNumbers(value);
  const text: string = numbers.join('');

  return text.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function validCalc(x: number, numbers: number[]): number {
  const slice: number[] = numbers.slice(0, x);
  let factor: number = x - 7;
  let sum: number = 0;

  for (let i = x; i >= 1; i--) {
    const n: number = slice[x - i];
    sum += n * factor--;
    if (factor < 2) factor = 9;
  }

  const result: number = 11 - (sum % 11);
  return result > 9 ? 0 : result;
}

function matchNumbers(value: string | number | number[] = ''): number[] {
  const match: RegExpMatchArray | null = value.toString().match(/\d/g);
  return Array.isArray(match) ? match.map(Number) : [];
}

export function validaCNH(cnh: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNH: string = cnh.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCNH.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (sequência inválida)
  if (cleanCNH.charAt(0).repeat(11) === cleanCNH) {
    return false;
  }

  // Cálculo do primeiro dígito verificador (DV1)
  // Multiplica os 9 primeiros dígitos por 2, 3, 4, 5, 6, 7, 8, 9, 10
  let soma1: number = 0;
  for (let i = 0; i < 9; i++) {
    soma1 += parseInt(cleanCNH.charAt(i)) * (i + 2);
  }

  const resto1: number = soma1 % 11;
  const dv1: number = resto1 >= 10 ? 0 : 11 - resto1;

  // Cálculo do segundo dígito verificador (DV2)
  // Multiplica os 9 primeiros dígitos por 3, 4, 5, 6, 7, 8, 9, 10, 11
  // e o DV1 por 2
  let soma2: number = 0;
  for (let i = 0; i < 9; i++) {
    soma2 += parseInt(cleanCNH.charAt(i)) * (i + 3);
  }
  soma2 += dv1 * 2;

  const resto2: number = soma2 % 11;
  const dv2: number = resto2 >= 10 ? 0 : 11 - resto2;

  // Verifica se os dígitos calculados conferem com os informados
  const dvCalculado: string = dv1.toString() + dv2.toString();
  const dvInformado: string = cleanCNH.substr(-2);

  return dvCalculado === dvInformado;
}

export function validaDocumento(doc: string): boolean {
  const cleanDoc: string = doc.replace(/[^\d]/g, '');
  if (cleanDoc.length === 11) return validaCPF(cleanDoc);
  if (cleanDoc.length === 14) return validaCNPJ(cleanDoc);
  if (cleanDoc.length === 11) return validaCNH(cleanDoc);
  return false;
}
