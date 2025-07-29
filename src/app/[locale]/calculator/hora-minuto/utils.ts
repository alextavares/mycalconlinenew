export function calcularDiferencaTempo(horaInicial: string, horaFinal: string, formatoHora: string): { intervalo: string, horas: number, minutos: number } {
  if (formatoHora !== '12' && formatoHora !== '24') {
    throw new Error('Formato de hora inválido. Deve ser "12" ou "24".');
  }

  const [horaInicialStr, minutoInicialStr] = horaInicial.split(':');
  const [horaFinalStr, minutoFinalStr] = horaFinal.split(':');

  const horaInicialNum = parseInt(horaInicialStr, 10);
  const minutoInicialNum = parseInt(minutoInicialStr, 10);
  const horaFinalNum = parseInt(horaFinalStr, 10);
  const minutoFinalNum = parseInt(minutoFinalStr, 10);

  if (isNaN(horaInicialNum) || isNaN(minutoInicialNum) || isNaN(horaFinalNum) || isNaN(minutoFinalNum)) {
    throw new Error('Formato de hora inválido.');
  }
    
  let diffMinutos = 0;
  let diffHoras = 0;

  if (formatoHora === '12') {
    const isInicialPM = horaInicialNum >= 12;
    const isFinalPM = horaFinalNum >= 12;

    let inicioHora24 = horaInicialNum % 12;
    if (isInicialPM) {
        inicioHora24 += 12;
    }

    let finalHora24 = horaFinalNum % 12;
    if (isFinalPM) {
        finalHora24 += 12;
    }

    diffMinutos = minutoFinalNum - minutoInicialNum;
    diffHoras = finalHora24 - inicioHora24;

    if (finalHora24 < inicioHora24) {
      diffHoras += 24;
    }
  } else {
      diffMinutos = minutoFinalNum - minutoInicialNum;
      diffHoras = horaFinalNum - horaInicialNum;
        if (horaFinalNum < horaInicialNum) {
            diffHoras += 24;
        }
  }
    
  if (diffMinutos < 0) {
    diffHoras--;
    diffMinutos += 60;
  }
  
  const intervalo = `${diffHoras.toString().padStart(2, '0')}:${diffMinutos.toString().padStart(2, '0')}`;

  return {
    intervalo,
    horas: diffHoras,
    minutos: diffMinutos,
  };
}
