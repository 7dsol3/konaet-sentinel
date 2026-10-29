/* Configuração do site. Editar apenas este arquivo para trocar preço, chave PIX
   ou contato. A chave PIX começa vazia de propósito: sem ela o checkout avisa
   que o pagamento não está configurado e não gera um QR Code falso. */
window.KONAET = {
  version: "1.4.0",
  contact: {
    // Link curto do WhatsApp já usado pela Konaet.
    whatsapp: "https://wa.me/message/43CXZJ7NW2FPDO",
    // Opcional: número com DDI/DDD (só dígitos). Se preenchido, o checkout abre
    // a conversa com o resumo do pedido já escrito.
    whatsappNumber: ""
  },
  pix: {
    // Chave PIX do recebedor (e-mail, telefone, CPF/CNPJ ou aleatória).
    // Enquanto estiver vazia, o checkout permanece em modo "não configurado".
    key: "",
    merchant: "KONAET",
    city: "SAO PAULO"
  },
  plans: {
    pro: {
      title: "Licença Pro · 30 dias",
      desc: "1 servidor de produção",
      price: 79.0,
      txidPrefix: "KSNTPRO"
    },
    network: {
      title: "Licença Network · 30 dias",
      desc: "até 5 servidores",
      price: 299.0,
      txidPrefix: "KSNTNET"
    }
  }
};
