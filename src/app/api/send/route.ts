import { FJPWelcomeEmail } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, firstName, username, password, subject } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "FJP Consultoria <naoresponda@fjp.goduck.com.br>",
      to: [to],
      subject: subject || "Bem-vindo à FJP Consultoria!",
      react: FJPWelcomeEmail({ customerName: firstName, accessData: { username, password } }),
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify(data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
}
