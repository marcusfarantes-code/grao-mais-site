import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Fontes da marca guardadas em public/, para o render não depender da internet
const display = "Bricolage Grotesque";
const texto = "Manrope";
loadFont({ family: display, url: staticFile("bricolage-800.woff2"), weight: "800" });
loadFont({ family: texto, url: staticFile("manrope.woff2"), weight: "200 800" });

const COR = { roxo: "#3D2385", grao: "#F2A541", aveia: "#F6F3EE", noite: "#0E0820" };
const ENTRADA = 18; // quadros antes do vídeo do app começar
const FIM = 36; // quadros parados no fim

// Esquilo do Grão+ (mesmo desenho do app, scripts/esquilo.mjs)
const Esquilo: React.FC<{ cor: string; grao?: string; style?: React.CSSProperties }> = ({ cor, grao = COR.grao, style }) => (
  <svg viewBox="88 108 396 352" style={style}>
    <path d="M296 452 C408 452 472 382 472 296 C472 198 404 128 324 122 C280 119 246 138 232 168 C262 164 294 172 318 192 C354 222 382 262 382 310 C382 368 346 406 300 416 C306 432 304 446 296 452 Z" fill={cor} />
    <path fillRule="evenodd" d="M156 452 C146 410 150 352 176 316 C196 290 222 280 250 284 C292 290 312 338 308 392 C306 422 298 442 288 452 Z M174 362 C174 330 196 318 216 318 L217 304 L229 304 L228 318 C248 320 266 332 266 362 L261 368 C261 404 244 432 220 439 C196 432 179 404 179 368 Z" fill={cor} />
    <path fillRule="evenodd" d="M268 238 C268 276 236 300 200 300 C176 300 156 290 138 276 L114 260 C98 250 98 234 112 228 L140 214 C150 186 172 170 202 170 C238 170 268 200 268 238 Z M182 234 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 Z" fill={cor} />
    <path d="M188 182 L206 132 C210 120 228 120 232 132 L252 196 Z" fill={cor} />
    <path d="M182 360 C182 336 200 326 220 326 C240 326 258 336 258 360 Z" fill={grao} />
    <path d="M187 370 L253 370 C253 402 238 424 220 430 C202 424 187 402 187 370 Z" fill={grao} />
    <path d="M216 328 L218 312 L226 312 L224 328 Z" fill={grao} />
  </svg>
);

type Props = { clipe: string; olho: string; titulo: string; texto: string };

const sobe = (frame: number, ini: number, dur = 20) => ({
  opacity: interpolate(frame, [ini, ini + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  translate: interpolate(frame, [ini, ini + dur], ["0px 40px", "0px 0px"], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
});

export const Demo: React.FC<Props> = ({ clipe, olho, titulo, texto: apoio }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.roxo, fontFamily: texto, color: "white" }}>
      <Esquilo cor="rgba(255,255,255,0.06)" grao="rgba(255,255,255,0.06)" style={{ position: "absolute", width: 900, left: -260, bottom: -170 }} />

      <div style={{ position: "absolute", left: 80, top: 110, width: 430, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ ...sobe(frame, 0), fontSize: 26, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: COR.grao }}>{olho}</div>
        <div style={{ ...sobe(frame, 4), fontFamily: display, fontWeight: 800, fontSize: 76, lineHeight: 1.02, letterSpacing: "-0.02em" }}>{titulo}</div>
        <div style={{ ...sobe(frame, 10), fontSize: 36, lineHeight: 1.35, fontWeight: 500, opacity: 0.88 * interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{apoio}</div>
      </div>

      <div style={{ ...sobe(frame, 0, 18), position: "absolute", left: 80, bottom: 100, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Esquilo cor="white" style={{ width: 46 }} />
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 44 }}>Grão<span style={{ color: COR.grao }}>+</span></div>
      </div>

      <div style={{
        position: "absolute", right: 70, top: 144, width: 506, height: 1062, borderRadius: 64, background: COR.noite, padding: 14,
        boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
        translate: interpolate(frame, [0, 24], ["0px 140px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 52, overflow: "hidden", background: COR.aveia, position: "relative" }}>
          <Sequence from={ENTRADA} durationInFrames={durationInFrames - ENTRADA} premountFor={30}>
            <Video src={staticFile(clipe)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const VIDEOS = [
  { id: "Inicio", clipe: "inicio.mp4", segundos: 7.23, olho: "Início", titulo: "Quanto sobrou no mês, num olhar.", texto: "Tocas, gastos por potinho e por banco e o histórico de 6 meses." },
  { id: "Importar", clipe: "importar.mp4", segundos: 10.6, olho: "Importação", titulo: "Importe o extrato e confira.", texto: "OFX, CSV, PDF ou print. Você escolhe o potinho antes de gravar." },
  { id: "Tocas", clipe: "tocas.mp4", segundos: 7.27, olho: "Tocas e potinhos", titulo: "Seu orçamento em dois níveis.", texto: "Cada potinho mostra quanto já foi e quanto ainda cabe." },
  { id: "Cartoes", clipe: "cartoes.mp4", segundos: 6.57, olho: "Cartões de crédito", titulo: "Cada compra na fatura certa.", texto: "Fechamento, vencimento, pagamentos e limite de cada cartão." },
];

export const MyComposition = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition key={v.id} id={v.id} component={Demo} fps={30} width={1080} height={1350}
        durationInFrames={ENTRADA + Math.ceil(v.segundos * 30) + FIM}
        defaultProps={{ clipe: v.clipe, olho: v.olho, titulo: v.titulo, texto: v.texto }} />
    ))}
  </>
);
