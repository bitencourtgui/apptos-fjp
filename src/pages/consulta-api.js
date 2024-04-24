// File: pages/consulta-processo.tsx
import { useState } from "react";
import { format, parseISO } from 'date-fns';

export default function ConsultaProcesso() {
  const [numeroProcesso, setNumeroProcesso] = useState("");
  const [data, setData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/consulta-processo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numeroProcesso: numeroProcesso,
      }),
    });

    const data = await response.json();

    setData(data?.hits?.hits[0]?._source);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Número do Processo:
          <input
            type="text"
            value={numeroProcesso}
            onChange={(e) => setNumeroProcesso(e.target.value)}
          />
        </label>
        <button type="submit">Consultar</button>
      </form>

      {data && (
        <div key={data.numeroProcesso}>
          <h2>Resultado:</h2>
          <p>Ultima Atualização: {format(parseISO(data.dataHoraUltimaAtualizacao), 'dd/MM/yyyy - HH:mm:ss')}</p>
          <p>Tribunal: {data.tribunal}</p>
          <p>Data de Ajuizamento: {format(parseISO(data.dataAjuizamento), 'dd/MM/yyyy - HH:mm:ss')}</p>
          <p>Grau: {data.grau}</p>
          <p>Nível de Sigilo: {data.nivelSigilo}</p>
          <p>Formato: {data.formato?.nome}</p>
          <p>Sistema: {data.sistema?.nome}</p>
          <p>Classe: {data.classe?.nome}</p>
          <p>Assuntos:</p>
          {data.assuntos && (
            <ul>
              {data.assuntos.map((assunto) => (
                <li key={assunto.codigo + Math.random()}>
                  [{assunto.codigo}] - {assunto.nome}
                </li>
              ))}
            </ul>
          )}
          <p>Órgão Julgador: {data.orgaoJulgador?.nome}</p>
          <p>Movimentos:</p>
          {data.movimentos && (
            <ul>
              {data.movimentos.map((movimento) => (
                <li key={movimento.codigo + Math.random()}>
                  <p>Nome: {movimento.nome}</p>
                  <p>Código: {movimento.codigo}</p>
                  <p>Data e Hora: {format(parseISO(movimento.dataHora), 'dd/MM/yyyy - HH:mm:ss')}</p>
                  {movimento.complementosTabelados && (
                    <ol>
                      {movimento.complementosTabelados.map((complemento) => (
                        <li key={complemento.codigo + Math.random()}>
                          <p>-Nome: {complemento.nome}</p>
                          <p>Valor: {complemento.valor}</p>
                          <p>Descrição: {complemento.descricao}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}