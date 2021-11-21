import * as math from 'mathjs';

export function calculateTransformCoefficients(
  functionValues: math.Complex[],
  fromIndex: number,
  toIndex: number
): math.Complex[] {
  const coefficients: math.Complex[] = [];
  for (let i = fromIndex; i <= toIndex; i++) {
    const coefficient = calculateTransformCoefficient(functionValues, i);
    coefficients.push(coefficient);
  }
  return coefficients;
}

function calculateTransformCoefficient(functionValues: math.Complex[], index: number) {
  let result = math.complex(0, 0);
  for (let t = 0; t < functionValues.length; t++) {
    const tNormalized = t / functionValues.length;
    // - n * 2 * Pi * i * t
    const exponent = math.multiply(math.complex(0, 1), -index * 2 * math.pi * tNormalized) as math.Complex;
    // e ^ (- n * 2 * Pi * i * t)
    const eTimesExponent = math.pow(math.e, exponent) as math.Complex;
    // f(t) * e ^ (n * 2 * Pi * i * t)
    const functionTimesE = math.multiply(functionValues[t], eTimesExponent) as math.Complex;
    // f(t) * e ^ (n * 2 * Pi * i * t) / dt
    const subresult = math.divide(functionTimesE, functionValues.length);

    result = math.add(result, subresult) as math.Complex;
  }
  return result;
}
