import type { Metadata } from "next";
import { socialMetadata } from "@/lib/metadata";

const title = "Política de privacidad | Doppler";
const description = "Qué datos recopila Doppler en www.doppler.la, para qué los usa y cómo ejercer tus derechos.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacidad" },
  ...socialMetadata({ title, description, path: "/privacidad" }),
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "Qué datos recopilamos",
    body: [
      "Formulario de contacto: tu nombre, tu email y el mensaje que nos escribís.",
      "Chat con el asistente: el contenido de la conversación y los datos de contacto que compartas en ella. Al finalizar, un resumen se envía por email a nuestro equipo.",
      "Datos de navegación: con Google Analytics 4 medimos las páginas que visitás, el tipo de dispositivo, el navegador, la ubicación aproximada y las acciones en el sitio (por ejemplo, el envío de un formulario). Para eso se usan cookies o identificadores similares.",
      "Datos técnicos: tu dirección IP se procesa para limitar el uso abusivo del chat.",
    ],
  },
  {
    title: "Para qué los usamos",
    body: [
      "Responder tu consulta y coordinar una reunión.",
      "Entender cómo se usa el sitio y mejorar su contenido y su rendimiento.",
      "Medir el resultado de nuestras campañas publicitarias, si las hubiera.",
      "Proteger el sitio y el chat contra abusos.",
    ],
  },
  {
    title: "Con quién los compartimos",
    body: [
      "Usamos proveedores que procesan datos en nuestro nombre: Vercel (alojamiento del sitio), Resend (envío de emails), Anthropic (procesamiento de las respuestas del asistente del chat), Upstash (límite de uso del chat) y Google (Analytics y, si corresponde, Google Ads).",
      "No vendemos tus datos personales.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "El sitio usa cookies de Google Analytics para medir la audiencia. Podés bloquearlas o eliminarlas desde la configuración de tu navegador, o instalar el complemento de inhabilitación de Google Analytics. Si las bloqueás, el sitio sigue funcionando con normalidad.",
    ],
  },
  {
    title: "Tus derechos",
    body: [
      "Podés solicitar el acceso, la rectificación o la supresión de tus datos personales, y oponerte a su tratamiento. Para hacerlo, escribinos por el chat o el formulario de contacto de www.doppler.la indicando qué querés solicitar.",
      "En Argentina, la Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326 de Protección de los Datos Personales y atiende las denuncias y reclamos de quienes consideren vulnerados sus derechos.",
    ],
  },
  {
    title: "Conservación",
    body: ["Conservamos los datos el tiempo necesario para las finalidades descriptas o mientras la ley lo exija."],
  },
  {
    title: "Cambios en esta política",
    body: ["Podemos actualizar esta política. La fecha de la última actualización figura al inicio de la página."],
  },
];

export default function PrivacyPage() {
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground">Política de privacidad</h1>
        <p className="mt-4 text-sm text-muted">Última actualización: 28 de octubre de 2026</p>
        <p className="mt-6 text-muted">
          Esta política explica cómo Doppler trata los datos personales que se recopilan en www.doppler.la.
        </p>
        {sections.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-muted">
              {section.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
