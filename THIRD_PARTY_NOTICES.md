# Avisos de terceiros

O Konaet Sentinel usa os componentes abaixo. Cada um mantém sua própria licença.
Nenhum deles é modelo de IA, biblioteca de outro anti-cheat ou código de
terceiros incorporado sem crédito.

## qrcodejs

`site/assets/qrcode.js` — biblioteca de QR Code para navegador, por davidshimjs.
Incluída apenas para desenhar o BR Code do PIX no checkout; não é carregada de
CDN.

```
Copyright (c) 2012 davidshimjs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

Fonte: <https://github.com/davidshimjs/qrcodejs> · Licença MIT.

## Ed25519 (RFC 8032)

`sentinel/_ed25519.py` é uma adaptação da implementação de referência do RFC
8032, em domínio público, publicada pelos autores do Ed25519 (Daniel J.
Bernstein, Niels Duif, Tanja Lange, Peter Schwabe e Bo-Yin Yang). A adaptação
mantém a matemática e adiciona um invólucro para a verificação de licenças.

Fonte: <https://www.rfc-editor.org/rfc/rfc8032> · Domínio público.

## Python

O produto é escrito em Python e usa apenas a biblioteca padrão. O binário de
avaliação para Windows é gerado com PyInstaller.

- Python: <https://www.python.org/> · Licença PSF.
- PyInstaller: <https://pyinstaller.org/> · GPL 2.0 com exceção de bootloader,
  que permite distribuir programas proprietários empacotados.

## Fontes do site

O site e o dashboard servem localmente Fraunces, Instrument Sans e IBM Plex
Mono em `site/assets/fonts/`. As três famílias estão sob a SIL Open Font
License 1.1; o texto completo acompanha a pasta em
`site/assets/fonts/OFL.txt` e os créditos em
`site/assets/fonts/FONT-LICENSES.md`. Nenhuma fonte é carregada de CDN.

As capturas de tela antigas podem conter Segoe UI e Consolas, fontes do sistema
Windows que não são redistribuídas.

## Arte

A arte de fundo, o logo, a capa social e as capturas foram produzidos para a
Konaet com ferramentas de geração de imagem e renderização local. Não há arte
de terceiros incorporada ao produto. Pillow, segno e Playwright foram usados
apenas na geração de imagens e não acompanham o produto em execução.

## Marcas

Minecraft é marca de Mojang Studios/Microsoft; DayZ, Infestation: The New Z,
PUBG, Call of Duty e Battlefield pertencem às respectivas publicadoras. Bukkit,
Spigot e Paper pertencem aos respectivos projetos. A Konaet não é afiliada a
nenhuma delas. O adaptador de referência usa apenas eventos do servidor que o
operador controla ou está autorizado a operar.
