
import express from 'express';
import cors from 'cors';
import { validateRegistration } from './validation.js';

const app = express();

app.disable('x-powered-by');

// Yerel geliştirme için varsayılan olarak tüm kaynaklara izin verilir.
// Üretimde CORS_ORIGIN değişkeniyle izin verilen kaynakları sınırlandırın.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((value) => value.trim())
  : true;

app.use(cors({ origin: allowedOrigins }));

// Aşırı büyük istek gövdelerini sınırlandır.
app.use(express.json({
  limit: '10kb',
  strict: true
}));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/register', (req, res) => {
  const result = validateRegistration(req.body);

  if (!result.valid) {
    return res.status(400).json({
      message: 'Lütfen alanları kontrol edin.',
      errors: result.errors
    });
  }

  // Demo sürümü veritabanına kayıt yapmaz.
  return res.status(201).json({
    message:
      'Doğrulama başarılı. Demo sürümünde hesap oluşturulmadı.'
  });
});

app.use((_req, res) => {
  res.status(404).json({
    message: 'İstenen kaynak bulunamadı.'
  });
});

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'İstek çok büyük. Lütfen daha kısa bilgiler girin.'
    });
  }

  if (
    err instanceof SyntaxError &&
    Object.prototype.hasOwnProperty.call(err, 'body')
  ) {
    return res.status(400).json({
      message: 'İstek biçimi geçersiz.'
    });
  }

  // İstek gövdesi, parola veya hata nesnesi loglanmaz.
  return res.status(500).json({
    message: 'Beklenmeyen bir sunucu hatası oluştu.'
  });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`registration_form API'si ${port} portunda hazır.`);
});
