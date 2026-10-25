
import { useState } from 'react';
import { validateRegistration } from './validation.js';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function RegisterForm() {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  function update(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value
    }));

    setStatus('');
  }

  async function submit(event) {
    event.preventDefault();
    setStatus('');

    const result = validateRegistration(values);
    setErrors(result.errors);

    if (Object.keys(result.errors).length > 0) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: result.normalized.username,
          email: result.normalized.email,
          password: values.password
        })
      });

      const body = await response.json();

      if (!response.ok) {
        setErrors(body.errors || {});
        setStatus(
          body.message || 'Kayıt isteği tamamlanamadı.'
        );
        return;
      }

      setValues({
        username: '',
        email: '',
        password: ''
      });

      setErrors({});
      setStatus(body.message || 'İşlem başarılı.');
    } catch {
      // Form değerleri ve hata nesneleri loglanmaz.
      setStatus(
        'Sunucuya bağlanılamadı. API sunucusunun çalıştığını kontrol edin.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">REGISTRATION_FORM</p>
        <h1>Kayıt formu</h1>
        <p className="intro">
          Devam etmek için alanları doldurun.
        </p>

        <form onSubmit={submit} noValidate>
          <label htmlFor="username">Kullanıcı adı</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            maxLength={10000}
            value={values.username}
            onChange={update}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={
              errors.username ? 'username-error' : undefined
            }
          />

          {errors.username && (
            <p className="error" id="username-error">
              {errors.username}
            </p>
          )}

          <label htmlFor="email">E-posta</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={10000}
            value={values.email}
            onChange={update}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? 'email-error' : undefined
            }
          />

          {errors.email && (
            <p className="error" id="email-error">
              {errors.email}
            </p>
          )}

          <label htmlFor="password">Parola</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            maxLength={10000}
            value={values.password}
            onChange={update}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? 'password-error'
                : 'password-hint'
            }
          />

          {errors.password ? (
            <p className="error" id="password-error">
              {errors.password}
            </p>
          ) : (
            <p className="hint" id="password-hint">
              12–128 karakter; küçük/büyük harf, rakam ve özel karakter.
            </p>
          )}

          <button type="submit" disabled={busy}>
            {busy ? 'Kontrol ediliyor…' : 'Kayıt ol'}
          </button>
        </form>

        {status && (
          <p className="status" role="status">
            {status}
          </p>
        )}

        <p className="footnote">
          Demo sürümünde hesap oluşturulmaz. Parola ve form
          değerleri hata mesajlarına yazdırılmaz.
        </p>
      </section>
    </main>
  );
}
