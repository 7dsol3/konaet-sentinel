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

A build 1.2.1 usa `--onedir` (pasta com `_internal/`) e abre o dashboard com
duplo clique. Para ver a prova no console:

```bat
konaet-sentinel.exe prove
konaet-sentinel.exe audit
```

O `prove` roda as sessões de referência e mostra os gates. O `audit` confere o
modelo, o benchmark, a robustez, os oito perfis, o ledger e o SHA do executável
contra o `HASHES.txt` do pacote; `audit --json` gera o relatório com hash
próprio. Nenhum dos dois envia dados.

Relatórios públicos do motor: [benchmark.json](assets/benchmark.json) e
[robustness.json](assets/robustness.json). Ambos são sintéticos; leia o aviso
dentro dos arquivos. A [central de provas](provas.html) reúne os números, os
limites e a comparação de arquitetura com outros anti-cheats — sem alegar
superioridade sem protocolo pareado.

## Verificar o download

SHA-256 do ZIP publicado (v1.2.1):

```
b004f5ac91a6e3e389cb66647457357051b5377be5321c3c4c46d3ae3ca11841
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
robustez a perda, duplicata, ruído, atraso e teleporte também é simulada. Leia
[legal.html](legal.html) e os documentos do pacote antes de usar em produção.
O comando `conceal_targets` só vale no servidor que você opera e não é
invisibilidade no cliente nem integração com anti-cheat oficial.

© 2026 Konaet. Software proprietário.
