import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { numeroProcesso, tribunal } = await request.json();

  if (!numeroProcesso || !tribunal) {
    return NextResponse.json(
      { error: "Missing required fields: numeroProcesso and tribunal" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api-publica.datajud.cnj.jus.br/api_publica_${tribunal}/_search`,
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
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error fetching data", details: errorMessage },
      { status: 500 },
    );
  }
}
