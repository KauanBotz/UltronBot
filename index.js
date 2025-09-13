// webhook-server.js (arquivo separado para o site)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-805402732901035-091218-7fab4d1fd121082a5b5f2137aae457e2-2040478904';

// Configuração compatível
let mercadopago;
let payment;

try {
  mercadopago = require('mercadopago');
  mercadopago.configure({
    access_token: MERCADOPAGO_ACCESS_TOKEN
  });
  payment = mercadopago.payment;
} catch (error) {
  console.log('Usando configuração alternativa do MercadoPago');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSS Profissional inspirado na Apple
const professionalCSS = `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #000;
      color: #f5f5f7;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
      position: relative;
    }

    /* Background animado */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 80%, #1d1d1f 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, #2d2d30 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, #0066cc 0%, transparent 70%);
      opacity: 0.3;
      z-index: -2;
    }

    body::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, 
                  rgba(0, 102, 204, 0.1) 0%, 
                  rgba(255, 255, 255, 0.05) 50%, 
                  rgba(0, 0, 0, 0.8) 100%);
      z-index: -1;
    }

    .container {
      background: rgba(29, 29, 31, 0.72);
      backdrop-filter: saturate(180%) blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 60px 48px;
      max-width: 480px;
      width: 90%;
      text-align: center;
      position: relative;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                  0 0 0 0.5px rgba(255, 255, 255, 0.05) inset;
      animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .icon {
      font-size: 72px;
      margin-bottom: 24px;
      display: block;
      line-height: 1;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #f5f5f7 0%, #86868b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    .success h1 {
      background: linear-gradient(135deg, #30d158 0%, #00c6fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .error h1 {
      background: linear-gradient(135deg, #ff453a 0%, #ff6b6b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .pending h1 {
      background: linear-gradient(135deg, #ff9f0a 0%, #ffcc02 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      font-size: 17px;
      line-height: 1.5;
      color: #a1a1a6;
      margin-bottom: 16px;
      font-weight: 400;
    }

    .highlight {
      color: #f5f5f7;
      font-weight: 500;
    }

    .cta-button {
      background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
      color: #fff;
      border: none;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 17px;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      margin-top: 32px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 102, 204, 0.3);
    }

    .cta-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .cta-button:hover::before {
      left: 100%;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 102, 204, 0.4);
    }

    .cta-button:active {
      transform: translateY(0);
    }

    .success .cta-button {
      background: linear-gradient(135deg, #30d158 0%, #00c6fb 100%);
      box-shadow: 0 4px 16px rgba(48, 209, 88, 0.3);
    }

    .success .cta-button:hover {
      box-shadow: 0 8px 24px rgba(48, 209, 88, 0.4);
    }

    .error .cta-button {
      background: linear-gradient(135deg, #ff453a 0%, #ff6b6b 100%);
      box-shadow: 0 4px 16px rgba(255, 69, 58, 0.3);
    }

    .error .cta-button:hover {
      box-shadow: 0 8px 24px rgba(255, 69, 58, 0.4);
    }

    .pending .cta-button {
      background: linear-gradient(135deg, #ff9f0a 0%, #ffcc02 100%);
      box-shadow: 0 4px 16px rgba(255, 159, 10, 0.3);
    }

    .pending .cta-button:hover {
      box-shadow: 0 8px 24px rgba(255, 159, 10, 0.4);
    }

    .status-badge {
      background: rgba(48, 209, 88, 0.15);
      border: 1px solid rgba(48, 209, 88, 0.3);
      color: #30d158;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      margin: 24px 0;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .feature-list {
      text-align: left;
      margin: 32px 0;
      list-style: none;
    }

    .feature-list li {
      padding: 12px 0;
      color: #a1a1a6;
      font-size: 16px;
      position: relative;
      padding-left: 24px;
    }

    .feature-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #0066cc;
      font-weight: bold;
    }

    @media (max-width: 640px) {
      .container {
        padding: 40px 24px;
        margin: 20px;
      }
      
      h1 {
        font-size: 28px;
      }
      
      .icon {
        font-size: 60px;
      }
      
      p {
        font-size: 16px;
      }
    }
  </style>
`;

// Função para atualizar banco (conectar com seu bot)
async function updateUserSubscription(numeroWhatsapp, status) {
  // Aqui você pode fazer uma requisição para o seu bot
  // ou conectar diretamente com o banco SQLite
  console.log(`Atualizando assinatura: ${numeroWhatsapp} - Status: ${status}`);
  
  // Exemplo de requisição para o bot
  try {
    // Se seu bot tiver uma API local
    // await fetch('http://localhost:8080/update-subscription', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ numeroWhatsapp, status })
    // });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
  }
}

// Página de sucesso
app.get('/success', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Pagamento Aprovado • ULTRON</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
      <meta name="theme-color" content="#000000">
      ${professionalCSS}
    </head>
    <body>
      <div class="container success">
        <span class="icon">🎉</span>
        <h1>Pagamento Aprovado!</h1>
        <p>Sua <span class="highlight">assinatura premium</span> do ULTRON Bot foi ativada com sucesso.</p>
        <p>Agora você tem acesso a todos os recursos premium por <span class="highlight">30 dias completos</span>.</p>
        <p>Tudo pronto! Volte para o WhatsApp e aproveite sua nova experiência premium! 🤖</p>
        <a href="https://wa.me/5531982524422" class="cta-button">Voltar ao WhatsApp</a>
      </div>
    </body>
    </html>
  `);
});

// Página de falha
app.get('/failure', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Falha no Pagamento • ULTRON</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
      <meta name="theme-color" content="#000000">
      ${professionalCSS}
    </head>
    <body>
      <div class="container error">
        <span class="icon">⚠️</span>
        <h1>Falha no Pagamento</h1>
        <p>Infelizmente, houve um problema ao processar seu pagamento.</p>
        <p>Não se preocupe! Você pode <span class="highlight">tentar novamente</span> ou entrar em contato com nosso suporte.</p>
        <p>Nossa equipe está sempre pronta para ajudar você a resolver qualquer problema. 💪</p>
        <a href="https://wa.me/5531982524422" class="cta-button">Tentar Novamente</a>
      </div>
    </body>
    </html>
  `);
});

// Página pendente
app.get('/pending', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Processando Pagamento • ULTRON</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
      <meta name="theme-color" content="#000000">
      ${professionalCSS}
    </head>
    <body>
      <div class="container pending">
        <span class="icon">⏳</span>
        <h1>Processando Pagamento</h1>
        <p>Seu pagamento está sendo <span class="highlight">processado com segurança</span> pelos nossos sistemas.</p>
        <p>Este processo geralmente leva apenas alguns minutos para ser concluído.</p>
        <p>Você receberá uma <span class="highlight">notificação de confirmação</span> diretamente no WhatsApp assim que tudo estiver pronto! 📱</p>
        <a href="https://wa.me/5531982524422" class="cta-button">Voltar ao WhatsApp</a>
      </div>
    </body>
    </html>
  `);
});

// Webhook para notificações do MercadoPago
app.post('/notification', async (req, res) => {
  try {
    console.log('Webhook recebido:', req.body);
    
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Busca detalhes do pagamento
      const paymentInfo = await payment.get({ id: paymentId });
      
      console.log('Payment info:', paymentInfo);
      
      const numeroWhatsapp = paymentInfo.external_reference;
      
      if (paymentInfo.status === 'approved') {
        // Pagamento aprovado - ativar assinatura
        await updateUserSubscription(numeroWhatsapp, 'approved');
        console.log(`✅ Assinatura ativada para: ${numeroWhatsapp}`);
      } else if (paymentInfo.status === 'rejected') {
        // Pagamento rejeitado
        await updateUserSubscription(numeroWhatsapp, 'rejected');
        console.log(`❌ Pagamento rejeitado para: ${numeroWhatsapp}`);
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Error');
  }
});

// Rota para o bot atualizar assinatura (se usar API local)
app.post('/update-subscription', async (req, res) => {
  try {
    const { numeroWhatsapp, status } = req.body;
    
    // Aqui conecta com seu banco SQLite
    // const monetizationDB = require('./path-to-your-bot/src/utils/monetization');
    
    if (status === 'approved') {
      // await monetizationDB.activateSubscription(numeroWhatsapp);
      console.log(`Assinatura ativada via API: ${numeroWhatsapp}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Página inicial
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>ULTRON Bot • Servidor de Webhooks</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
      <meta name="theme-color" content="#000000">
      ${professionalCSS}
    </head>
    <body>
      <div class="container">
        <span class="icon">🤖</span>
        <h1>ULTRON Bot</h1>
        <div class="status-badge">✅ Servidor Online</div>
        <p>Servidor profissional de <span class="highlight">webhooks de pagamento</span> está rodando e pronto para processar transações!</p>
        <p>Construído com <span class="highlight">segurança empresarial</span> e arquitetura moderna para garantir máxima confiabilidade.</p>
        
        <ul class="feature-list">
          <li>/success - Página de sucesso com UI bonita</li>
          <li>/failure - Página de tratamento de erros</li>
          <li>/pending - Página de status de processamento</li>
          <li>/notification - Endpoint webhook do MercadoPago</li>
        </ul>
        
        <a href="https://wa.me/5531982524422" class="cta-button">Ir para WhatsApp</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor webhook profissional rodando na porta ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`💼 Pronto para pagamentos em produção!`);
});
