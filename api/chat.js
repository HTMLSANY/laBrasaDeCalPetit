import { GoogleGenAI } from "@google/genai";

const INFO_RESTAURANTE = `
Eres el asistente virtual del restaurante "La Brasa de Cal Petit".
Responde de forma amable, breve y útil. Si te preguntan algo que NO está
en la información de abajo, di honestamente que no tienes ese dato y
sugiere contactar directamente con el restaurante.

NUNCA inventes precios, horarios, platos, promociones ni datos.
Responde siempre en el mismo idioma en que te escriba el cliente
(español, catalán, inglés, etc.).

═══ INFORMACIÓN DEL RESTAURANTE ═══

[PENDIENTE DE RELLENAR POR EL USUARIO]
- Nombre: La Brasa de Cal Petit
- Ubicación: [pendiente]
- Horarios: [pendiente]
- Teléfono: [pendiente]
- Carta y precios: [pendiente]
- Reservas: [pendiente]
- Alérgenos / opciones vegetarianas: [pendiente]
- Otros datos: [pendiente]
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Falta el campo 'message'" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const contents = [
      ...history.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents,
      config: {
        systemInstruction: INFO_RESTAURANTE,
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (err) {
    console.error("Error llamando a Gemma:", err);
    return res.status(500).json({
      error: "Error procesando la petición",
      detail: err.message,
    });
  }
}
