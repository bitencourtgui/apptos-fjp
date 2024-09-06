import { NextResponse } from "next/server";
import { ClientUpload } from "@/lib/apollo/client";
import { CREATE_DOCUMENT } from "@/graphql/mutations/createDocument";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const document = JSON.parse(formData.get("document") as string);
    const signers = JSON.parse(formData.get("signers") as string);
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded.");
    }

    const { data } = await ClientUpload.mutate({
      mutation: CREATE_DOCUMENT,
      variables: {
        document,
        signers,
        file,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.dir(error, {depth: null})
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to create document", details: errorMessage },
      { status: 500 },
    );
  }
}
