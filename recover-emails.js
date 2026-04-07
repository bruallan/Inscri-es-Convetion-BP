const imapSimple = require('imap-simple');
const { simpleParser } = require('mailparser');
const { google } = require('googleapis');
require('dotenv').config();

// ============================================================================
// SCRIPT PARA RECUPERAR INSCRIÇÕES A PARTIR DOS E-MAILS
// ============================================================================
// Como usar:
// 1. Instale as dependências executando no terminal:
//    npm install imap-simple mailparser dotenv googleapis
// 2. Crie um arquivo .env na mesma pasta deste script com as seguintes variáveis:
//    IMAP_USER=seu_email@dominio.com
//    IMAP_PASS=sua_senha_do_email
//    IMAP_HOST=imap.seudominio.com (ex: imap.gmail.com)
//    IMAP_PORT=993
//    GOOGLE_CLIENT_EMAIL=seu_client_email_do_google
//    GOOGLE_PRIVATE_KEY="sua_private_key_do_google"
//    SPREADSHEET_ID=id_da_sua_planilha
// 3. Execute o script:
//    node recover-emails.js
// ============================================================================

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT || 993,
    tls: true,
    authTimeout: 30000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

async function recoverEmails() {
  console.log('Iniciando recuperação de e-mails...');
  
  if (!process.env.IMAP_USER || !process.env.IMAP_PASS || !process.env.IMAP_HOST) {
    console.error('ERRO: Credenciais IMAP não configuradas no .env');
    return;
  }

  try {
    // 1. Conectar ao Google Sheets
    console.log('Conectando ao Google Sheets...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetName = spreadsheet.data.sheets[0].properties.title;
    
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'!A:H`,
    });
    const existingRows = getResponse.data.values || [];
    const existingCpfs = new Set(existingRows.map(row => row[2])); // CPF está no índice 2

    // 2. Conectar ao servidor de E-mail
    console.log('Conectando ao servidor de e-mail...');
    const connection = await imapSimple.connect(config);
    await connection.openBox('INBOX');

    // Buscar e-mails com o assunto "Nova Inscrição:"
    const searchCriteria = [
      ['HEADER', 'SUBJECT', 'Nova Inscrição:']
    ];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      markSeen: false
    };

    console.log('Buscando e-mails...');
    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`Foram encontrados ${messages.length} e-mails de inscrição.`);

    const newInscriptions = [];

    for (const item of messages) {
      const all = item.parts.find(part => part.which === '');
      const id = item.attributes.uid;
      const idHeader = 'Imap-Id: ' + id + '\r\n';
      
      const mail = await simpleParser(idHeader + all.body);
      const text = mail.text;

      // Extrair os dados usando Regex
      const nameMatch = text.match(/Nome:\s*(.+)/);
      const emailMatch = text.match(/E-mail:\s*(.+)/);
      const cpfMatch = text.match(/CPF:\s*(.+)/);
      const rgMatch = text.match(/RG:\s*(.+)/);
      const phoneMatch = text.match(/Celular:\s*(.+)/);
      const roleMatch = text.match(/Cargo:\s*(.+)/);
      const unitMatch = text.match(/Unidade:\s*(.+)/);
      const dateMatch = text.match(/Data:\s*(.+)/);

      if (nameMatch && cpfMatch) {
        const cpf = cpfMatch[1].trim();
        
        // Se o CPF ainda não está na planilha, adicionamos à lista para salvar
        if (!existingCpfs.has(cpf)) {
          newInscriptions.push([
            nameMatch[1].trim(),
            emailMatch ? emailMatch[1].trim() : '',
            cpf,
            rgMatch ? rgMatch[1].trim() : '',
            phoneMatch ? phoneMatch[1].trim() : '',
            roleMatch ? roleMatch[1].trim() : '',
            unitMatch ? unitMatch[1].trim() : '',
            dateMatch ? dateMatch[1].trim() : new Date().toLocaleString("pt-BR")
          ]);
          existingCpfs.add(cpf); // Evitar duplicatas no mesmo lote
        }
      }
    }

    // 3. Salvar os dados recuperados na planilha
    if (newInscriptions.length > 0) {
      console.log(`Salvando ${newInscriptions.length} novas inscrições na planilha...`);
      const nextRow = existingRows.length + 1;
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${sheetName}'!A${nextRow}:H${nextRow + newInscriptions.length - 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: newInscriptions,
        },
      });
      console.log('Inscrições recuperadas e salvas com sucesso!');
    } else {
      console.log('Nenhuma inscrição nova encontrada para recuperar (todas já estão na planilha).');
    }

    connection.end();
  } catch (error) {
    console.error('Ocorreu um erro durante a recuperação:', error);
  }
}

recoverEmails();
