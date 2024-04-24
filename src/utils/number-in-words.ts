export const numberInWords = (numero: number, unidade = true): string => {
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];

  const dezenas = [
    "",
    "dez",
    "vinte",
    "trinta",
    "quarenta",
    "cinquenta",
    "sessenta",
    "setenta",
    "oitenta",
    "noventa",
  ];

  const especiais = [
    "dez",
    "onze",
    "doze",
    "treze",
    "catorze",
    "quinze",
    "dezesseis",
    "dezessete",
    "dezoito",
    "dezenove",
  ];

  const centenas = [
    "",
    "cento",
    "duzentos",
    "trezentos",
    "quatrocentos",
    "quinhentos",
    "seiscentos",
    "setecentos",
    "oitocentos",
    "novecentos",
  ];

  const milhares = ["", "mil", "milhão", "milhões", "bilhão", "bilhões"];

  if (numero === 0) {
    return "zero reais";
  }

  const separarMilhares = (num: number): string[] => {
    const partes: string[] = [];
    let contador = 0;

    while (num > 0) {
      const parte = num % 1000;
      if (parte !== 0) {
        const partePorExtenso = converterNumero(parte);
        if (contador === 1) {
          partes.unshift(partePorExtenso + " " + milhares[contador]);
        } else if (contador === 2 && partePorExtenso !== "") {
          partes.unshift(partePorExtenso + " e " + milhares[contador]);
        } else if (milhares[contador]) {
          partes.unshift(partePorExtenso + " " + milhares[contador]);
        } else {
          partes.unshift(partePorExtenso);
        }
      }
      num = Math.floor(num / 1000);
      contador++;
    }

    return partes;
  };

  const converterNumero = (num: number): string => {
    if (num < 10) {
      return unidades[num];
    } else if (num < 20) {
      return especiais[num - 10];
    } else {
      const unidade = num % 10;
      const dezena = Math.floor(num / 10) % 10;
      const centena = Math.floor(num / 100);

      let resultado = centenas[centena];

      if (dezena !== 0) {
        resultado += resultado === "" ? "" : " e ";

        if (dezena === 1) {
          resultado += especiais[unidade];
        } else {
          resultado += dezenas[dezena];

          if (unidade !== 0) {
            resultado += " e " + unidades[unidade];
          }
        }
      } else if (unidade !== 0) {
        resultado += (resultado === "" ? "" : " e ") + unidades[unidade];
      }

      return resultado;
    }
  };

  const parteInteira = Math.floor(numero);
  const parteDecimal = Math.round((numero - parteInteira) * 100); // Converte a parte decimal para centavos

  const partesPorExtenso = separarMilhares(parteInteira);

  let resultado = partesPorExtenso.join(" ");

  if (parteInteira === 100) {
    resultado = "cem reais";
  } else if (parteInteira > 0 && unidade) {
    resultado += parteInteira === 1 ? " real" : " reais";
  }

  if (parteDecimal > 0) {
    resultado += " e " + converterNumero(parteDecimal);

    if (unidade) {
      resultado += parteDecimal === 1 ? " centavo" : " centavos";
    }
  }

  return resultado;
};
