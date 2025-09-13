// webhook-server.js (arquivo separado para o site)
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração MercadoPago
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-805402732901035-091218-7fab4d1fd121082a5b5f2137aae457e2-2040478904';
const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_ACCESS_TOKEN,
});
const payment = new Payment(client);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    <html>
    <head>
      <title>Pagamento Aprovado! 🎉</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          max-width: 500px;
        }
        .success-icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #4CAF50; margin-bottom: 20px; }
        .back-btn {
          background: #4CAF50;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          text-decoration: none;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✅</div>
        <h1>Pagamento Aprovado!</h1>
        <p>Sua assinatura do ULTRON Bot foi ativada com sucesso!</p>
        <p>Agora você tem acesso ilimitado a todos os comandos por 30 dias.</p>
        <p>Volte para o WhatsApp e aproveite! 🤖</p>
        <a href="https://wa.me/" class="back-btn">Voltar ao WhatsApp</a>
      </div>
    </body>
    </html>
  `);
});

// Página de falha
app.get('/failure', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pagamento Falhou 😔</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 20px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          min-height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          max-width: 500px;
        }
        .error-icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #ff4444; margin-bottom: 20px; }
        .back-btn {
          background: #ff4444;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          text-decoration: none;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="error-icon">❌</div>
        <h1>Pagamento Falhou</h1>
        <p>Houve um problema com seu pagamento.</p>
        <p>Tente novamente ou entre em contato com o suporte.</p>
        <a href="https://wa.me/" class="back-btn">Voltar ao WhatsApp</a>
      </div>
    </body>
    </html>
  `);
});

// Página pendente
app.get('/pending', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pagamento Pendente ⏳</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 20px;
          background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%);
          color: white;
          min-height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          max-width: 500px;
        }
        .pending-icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #ff9800; margin-bottom: 20px; }
        .back-btn {
          background: #ff9800;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          text-decoration: none;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="pending-icon">⏳</div>
        <h1>Pagamento Pendente</h1>
        <p>Seu pagamento está sendo processado.</p>
        <p>Você receberá uma confirmação em breve.</p>
        <p>Aguarde a confirmação no WhatsApp! 📱</p>
        <a href="https://wa.me/" class="back-btn">Voltar ao WhatsApp</a>
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
    <html>
    <head>
      <title>ULTRON Bot - Webhook Server</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          max-width: 600px;
        }
        .bot-icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #fff; margin-bottom: 20px; }
        .status { 
          background: #4CAF50; 
          padding: 10px 20px; 
          border-radius: 10px; 
          display: inline-block;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="bot-icon">🤖</div>
        <h1>ULTRON Bot</h1>
        <div class="status">✅ Webhook Server Online</div>
        <p>Servidor de pagamentos ativo e funcionando!</p>
        <p>Endpoints disponíveis:</p>
        <ul style="text-align: left; max-width: 300px; margin: 0 auto;">
          <li>/success - Página de sucesso</li>
          <li>/failure - Página de falha</li>
          <li>/pending - Página pendente</li>
          <li>/notification - Webhook MercadoPago</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server rodando na porta ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});