import express from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import path from "path";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON body
  app.use(express.json());

  // API Route to submit form data to Google Sheets
  app.post("/api/subscribe", async (req, res) => {
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

      // Append data to the sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "A:H", // Appends to the first available sheet
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[name, email, cpf, rg, phone, role, unit, new Date().toLocaleString("pt-BR")]],
        },
      });

      // Send Email Notification
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const adminEmail = process.env.ADMIN_EMAIL;

      if (smtpHost && smtpUser && smtpPass && adminEmail) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort) || 587,
          secure: Number(smtpPort) === 465, // true for 465, false for other ports
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
      } else {
        console.warn("Configurações de SMTP ausentes. O e-mail de notificação não foi enviado.");
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao salvar na planilha ou enviar e-mail:", error);
      res.status(500).json({ error: "Erro ao processar a inscrição." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
