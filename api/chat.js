const INFO_RESTAURANTE = `
Eres el asistente virtual del restaurante "La Brasa de Cal Petit".
Responde de forma amable, breve y útil. Si te preguntan algo que NO está
en la información de abajo, di honestamente que no tienes ese dato y
sugiere contactar directamente con el restaurante.

NUNCA inventes precios, horarios, platos, promociones ni datos.
Responde siempre en el mismo idioma en que te escriba el cliente
(español, catalán, inglés, etc.).

═══ INFORMACIÓN DEL RESTAURANTE ═══

- Nombre: La Brasa de Cal Petit
- Ubicación: Carrer d'Usandizaga, 8 · Badalona 08915
- Horarios: 09:00–21:00
- Teléfono: +34 601 313 331
- Email: info@labrasacalpetit.cat
- Redes sociales: @labrasacalpetit

─── RESERVAS ───
- Via WhatsApp: +34 601 313 331
- Via formulario web
- Para grupos de más de 10 personas: llamar directamente al teléfono

─── CARTA Y PRECIOS ───

ENTRANTES:
· Pa amb tomàquet i pernil ibèric — 8 €
  Pan de payés tostado con tomate de colgar y pernil ibèric de bellota.
· Croquetes de bacallà de la iaia — 9 €
  Croquetas cremosas de bacalao con bechamel y toque de ajo negro. Receta de 1978.
· Amanida de cabra gratinada amb mel — 11 € [VEGETARIANO]
  Brotes tiernos, remolacha asada, nueces y rulo de cabra gratinado con miel del Garraf.
· Anxoves del Cantàbric amb mantequilla — 13 €
  Anchoas 00 del Cantábrico sobre tosta de masa madre con mantequilla normanda.
· Escalivada amb romesco de la casa — 10 € [VEGANO]
  Pimientos y berenjenas asados a la brasa de encina con salsa romesco de avellanas.

PRINCIPALES:
· Arròs negre amb alioli de l'avi — 18 €
  Arroz negro con sepia y gambas, caldo de pescado de roca y alioli casero.
· Fideuà de marisc de la Costa — 20 €
  Fideos socarrats con calamar, mejillones, gambas y cigalas. Fondo de crustáceos.
· Lluç de la Barceloneta a la planxa — 22 €
  Merluza fresca del día a la plancha con verduras de temporada.
· Pollastre de pagès al forn — 19 €
  Pollo de payés asado con hierbas mediterráneas, patatas panaderas y ajos confitados.
· Costella de vedella a la brasa — 26 €
  Costilla de ternera madurada 30 días a la brasa de encina con chimichurri.
· Canelons de festa major — 17 € [SOLO FIN DE SEMANA]
  Canelones de carne estofada con bechamel trufada, gratinados al horno.

POSTRES:
· Crema catalana casolana — 6 €
· Tarta de llimona i merenga — 7 €
· Gelat de torró artesanal — 5 €
  Helado de turrón de Agramunt con almendras, aceite arbequina y sal Maldon.
· Figues amb formatge i mel de Garraf — 8 €
  Higos frescos con queso de oveja curado, nueces y miel de la Reserva del Garraf.

─── ALÉRGENOS Y DIETAS ESPECIALES ───
- VEGETARIANO: Amanida de cabra gratinada amb mel
- VEGANO: Escalivada amb romesco de la casa; Gelat de torró (consultar)
- GLUTEN: pa amb tomàquet, croquetes, fideuà, canelons, tarta de llimona (base de galleta)
- LÁCTEOS: croquetes (bechamel), amanida de cabra, tarta de llimona (mantequilla), canelons (bechamel)
- PESCADO/MARISCO: croquetes de bacallà, anxoves, arròs negre, fideuà, lluç
- FRUTOS SECOS: amanida de cabra (nueces), escalivada (avellanas en romesco), gelat de torró (almendras), figues (nueces)
- HUEVO: alioli de l'avi
Para información detallada de alérgenos, consultar al personal del restaurante.

─── OTROS DATOS ───
- Restaurante mediterráneo familiar fundado en 1978. Tercera generación al frente.
- La carta cambia con las estaciones; producto local y de temporada.
- Proveedores: pescadores de la Barceloneta, verduras del Maresme, carnes de payés del Penedès.
- Los canelones solo están disponibles el fin de semana.
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

    const apiKey = process.env.GOOGLE_API_KEY;
    const model = "gemma-4-26b-a4b-it";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = [
      ...history.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const body = {
      system_instruction: {
        parts: [{ text: INFO_RESTAURANTE }],
      },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    };

    const googleRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!googleRes.ok) {
      const errorData = await googleRes.json();
      console.error("Error de Google API:", JSON.stringify(errorData));
      return res.status(500).json({
        error: "Error de Google API",
        detail: errorData,
      });
    }

    const data = await googleRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sin respuesta";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Error en handler:", err);
    return res.status(500).json({
      error: "Error procesando la petición",
      detail: err.message,
    });
  }
}
