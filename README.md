# Konaet Sentinel — página e download

O jogo limpo volta a ser a regra. Esta é a vitrine pública do Konaet Sentinel:
anti-cheat comportamental com IA explicável, escudo de proteção em partida e
banimento manual por máquina. O código-fonte fica em repositório privado.

![Capa do Konaet Sentinel](assets/cover.jpg)

- Site: <https://7dsol3.github.io/konaet-sentinel/>
- Teste de 30 dias: [konaet-sentinel-trial.zip](assets/konaet-sentinel-trial.zip)
- Suporte: [WhatsApp da Konaet](https://wa.me/message/43CXZJ7NW2FPDO)

## O que o teste contém

Executável Windows (não pede Python), guia de integração, política de segurança,
relatório de confiabilidade e licença. O trial começa na primeira execução e
dura 30 dias. Ele não instala serviço, não abre porta fora do loopback e não
envia telemetria para a Konaet.

Perfis incluídos: Minecraft (referência, IA calibrada), DayZ, Infestation: The
New Z, PUBG, Call of Duty, Battlefield, CS2/CS:GO e genérico. Perfil não é
integração oficial: a telemetria precisa vir do servidor que você opera. O
perfil CS2 é para servidor comunitário/dedicado autorizado, não é VAC e não
cobre servidor oficial da Valve.

A build 1.4.0 usa `--onedir` (pasta com `_internal/`) e abre o dashboard com
duplo clique. Para ver a prova no console:

```bat
konaet-sentinel.exe prove
konaet-sentinel.exe audit
```

O `prove` roda as sessões de referência e mostra os dez gates, incluindo quatro
checagens da malha. O `audit` confere o modelo, o benchmark, a robustez, os oito
perfis, o ledger, o aprendizado, a malha e o SHA do executável contra o
`HASHES.txt` do pacote; `audit --json` gera o relatório com hash próprio.
Nenhum dos dois envia dados.

A malha autoritativa de efeito é a novidade da 1.4.0: quando o servidor chama a
decisão antes de aplicar dano, a posição aceita, o alcance, a linha de visão, a
geometria de mira, a cadência, o teto de dano e a dispersão do servidor definem
se o efeito passa. Ela não torna o protegido invulnerável, não remove o cheat do
PC do atacante e só funciona com adaptador no servidor que você opera. A prova
publicada é sintética (11 cenários, 110 disparos) e a validação pareada em
servidor real está marcada como `NOT_RUN`.

A memória de casos só muda com confirmação humana: o operador revisa a janela,
confirma a trapaça e o dashboard mostra os gates antes de ativar. O sistema não
aprende sozinho; o limite fora de distribuição está publicado.

Relatórios públicos do motor: [benchmark.json](assets/benchmark.json),
[robustness.json](assets/robustness.json),
[adaptation.json](assets/adaptation.json) e
[authority.json](assets/authority.json). Todos são sintéticos; leia o aviso
dentro dos arquivos. A [central de provas](provas.html) reúne os números, os
limites e a comparação de arquitetura com outros anti-cheats — sem alegar
superioridade sem protocolo pareado.

## Verificar o download

SHA-256 do ZIP publicado (v1.4.0):

```
05040a585852d46b6362da1462fa1d901c4f2b0e63fdbac965a0578903838b7e
```

O ZIP também contém `HASHES.txt` com o SHA-256 de cada arquivo. O executável
não tem assinatura digital; leia `COMECE_AQUI.txt` antes de interpretar um
aviso do Windows como detecção.

No Windows:

```bat
certutil -hashfile konaet-sentinel-trial.zip SHA256
```

## Limites

Nenhum anti-cheat detecta todos os cheats. O Sentinel mede, evidencia e mitiga;
o ban continua humano. O ban por máquina é um hash salgado com decisão manual,
não atestação de GPU. Os números do benchmark são de dataset sintético; a
robustez a perda, duplicata, ruído, atraso e teleporte também é simulada. A
memória aprendida reconhece o caso confirmado e vizinhos próximos — no protocolo
publicado, um cheat de outra família teve recall 0,000 — e não aprende sem
confirmação humana. Leia [legal.html](legal.html) e os documentos do pacote
antes de usar em produção. O comando `conceal_targets` só vale no servidor que
você opera e não é invisibilidade no cliente nem integração com anti-cheat
oficial.

© 2026 Konaet. Software proprietário.
