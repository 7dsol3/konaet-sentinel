# Konaet Sentinel — página e download

O jogo limpo volta a ser a regra. Esta é a vitrine pública do Konaet Sentinel:
anti-cheat comportamental com IA explicável, escudo de proteção em partida e
banimento manual por máquina. O código-fonte fica em repositório privado.

![Capa do Konaet Sentinel](assets/cover.jpg)

- Site: <https://7dsol3.github.io/konaet-sentinel/>
- Teste de 30 dias: [konaet-sentinel-trial.zip](assets/konaet-sentinel-trial.zip)
- Suporte: [WhatsApp da Konaet](https://wa.me/message/43CXZJ7NW2FPDO)

## O que o teste contém

Executável Windows (não pede Python), guia de integração, política de segurança
e licença. O trial começa na primeira execução e dura 30 dias. Ele não instala
serviço, não abre porta fora do loopback e não envia telemetria para a Konaet.

Perfis incluídos: Minecraft (referência, IA calibrada), DayZ, Infestation: The
New Z, PUBG, Call of Duty, Battlefield, CS2/CS:GO e genérico. Perfil não é
integração oficial: a telemetria precisa vir do servidor que você opera. O
perfil CS2 é para servidor comunitário/dedicado autorizado, não é VAC e não
cobre servidor oficial da Valve.

A build 1.1 usa `--onedir` (pasta com `_internal/`) e abre o dashboard com
duplo clique. Para ver a prova no console:

```bat
konaet-sentinel.exe prove
```

## Verificar o download

SHA-256 do ZIP publicado (v1.1.0):

```
88ff60836ec8387e801f1b9d38c884250f8a0484d72e67579873a974c0c97a07
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
não atestação de GPU. Os números do benchmark são de dataset sintético. Leia
[legal.html](legal.html) e os documentos do pacote antes de usar em produção.

© 2026 Konaet. Software proprietário.
