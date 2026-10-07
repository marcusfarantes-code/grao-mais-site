# Site do Grão+

Página de apresentação do Grão+ (finanças pessoais). O aplicativo fica em outro repositório.

| Caminho | O que é |
|---|---|
| `public/index.html` | O site inteiro (HTML e CSS num arquivo só) |
| `public/videos/` | Vídeos do app funcionando (MP4) e a capa de cada um (JPG) |
| `videos/` | Projeto Remotion que monta os vídeos |

## Vídeos

Os clipes em `videos/public/*.mp4` são gravações do app rodando no celular simulado (390×844, tela 2x), feitas com o servidor local do repositório do app (`npm run dev`) e dados de exemplo.

```sh
cd videos
npm install
npx remotion studio                 # pré-visualizar
npx remotion render Importar out/importar.mp4   # Inicio, Importar, Tocas, Cartoes
```

Depois de renderizar, copie os MP4 de `videos/out/` para `public/videos/`.

## Publicação

Cloudflare (Worker `grao-mais-site`), servindo a pasta `public` sem comando de build.
