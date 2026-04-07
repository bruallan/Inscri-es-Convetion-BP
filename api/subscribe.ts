import { google } from "googleapis";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, cpf, rg, phone, role, unit } = req.body;
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return res.status(500).json({ 
        error: "Configurações do Google Sheets ausentes no servidor. Verifique as variáveis de ambiente." 
      });
    }

    // Authenticate with Google using Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 1. Obter as informações da planilha para descobrir o nome da aba correta (vamos usar a primeira aba)
    console.log("Conectando à planilha ID:", spreadsheetId.substring(0, 5) + "...");
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetName = spreadsheet.data.sheets[0].properties.title;
    console.log("Usando a aba:", sheetName);

    // 2. Buscar os dados atuais para verificar CPF
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'!A:H`,
    });

    const rows = getResponse.data.values || [];
    console.log(`Total de linhas encontradas: ${rows.length}`);
    
    if (rows.length > 0) {
      // Find if any row has the same CPF (CPF is at index 2)
      const cpfExists = rows.some(row => {
        const rowCpf = String(row[2] || "").replace(/\D/g, "");
        const inputCpf = String(cpf || "").replace(/\D/g, "");
        return rowCpf === inputCpf;
      });
      
      if (cpfExists) {
        console.log("CPF já existe:", cpf);
        return res.status(400).json({ 
          error: "Este CPF já está inscrito na convenção. Apenas uma inscrição por CPF é permitida." 
        });
      }
    }

    // 3. Adicionar os dados
    // Voltando para o APPEND mas garantindo a aba correta e limpando espaços
    const values = [[
      name, 
      email, 
      cpf, 
      rg, 
      phone, 
      role, 
      unit, 
      new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    ]];

    console.log("Tentando salvar dados...");
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${sheetName}'!A1`, // Começa a procurar da A1
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log("Resposta do Google Sheets:", appendResponse.status, appendResponse.statusText);
    console.log("Dados salvos na linha:", appendResponse.data.updates?.updatedRange);

    // Send Email Notification (Optional)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (smtpHost && smtpUser && smtpPass && adminEmail) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"Botopremium Convention" <${smtpUser}>`,
        to: adminEmail,
        subject: `Nova Inscrição: ${name}`,
        text: `Uma nova inscrição foi realizada para a Botopremium Convention 2026.\n\nDetalhes:\nNome: ${name}\nE-mail: ${email}\nCPF: ${cpf}\nRG: ${rg}\nCelular: ${phone}\nCargo: ${role}\nUnidade: ${unit}\nData: ${new Date().toLocaleString("pt-BR")}`,
        html: `
          <h2>Nova Inscrição - Botopremium Convention 2026</h2>
          <p>Uma nova inscrição foi realizada.</p>
          <ul>
            <li><strong>Nome:</strong> ${name}</li>
            <li><strong>E-mail:</strong> ${email}</li>
            <li><strong>CPF:</strong> ${cpf}</li>
            <li><strong>RG:</strong> ${rg}</li>
            <li><strong>Celular:</strong> ${phone}</li>
            <li><strong>Cargo:</strong> ${role}</li>
            <li><strong>Unidade:</strong> ${unit}</li>
            <li><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</li>
          </ul>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar na planilha ou enviar e-mail:", error);
    res.status(500).json({ error: "Erro ao processar a inscrição." });
  }
}
