// File: pages/api/consulta-processo.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const numeroProcesso = req.body.numeroProcesso;

    try {
      const response = await fetch(
        "https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search",
        {
          method: "POST",
          headers: {
            Authorization: `APIKey ${process.env.NEXT_PUBLIC_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              match: {
                numeroProcesso: numeroProcesso,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
