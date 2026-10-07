import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
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

      <div style={{ position: "absolute", left: 80, top: 110, width: 430, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ ...sobe(frame, 0), fontSize: 26, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: COR.grao }}>{olho}</div>
        <div style={{ ...sobe(frame, 4), fontFamily: display, fontWeight: 800, fontSize: 76, lineHeight: 1.02, letterSpacing: "-0.02em" }}>{titulo}</div>
        <div style={{ ...sobe(frame, 10), fontSize: 36, lineHeight: 1.35, fontWeight: 500, opacity: 0.88 * interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{apoio}</div>
      </div>

      <div style={{ ...sobe(frame, 0, 18), position: "absolute", left: 80, bottom: 100, display: "flex", alignItems: "center", gap: 16 }}>
        <Img src={staticFile("bolota.jpg")} style={{ width: 64, height: 64, borderRadius: 16 }} />
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
