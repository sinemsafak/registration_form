
export function validateRegistration(input) {
  const errors = {};

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      valid: false,
      errors: {
        form: 'Geçerli bir kayıt isteği gönderin.'
      }
    };
  }

  const username =
    typeof input.username === 'string'
      ? input.username.trim()
      : '';

  const email =
    typeof input.email === 'string'
      ? input.email.trim()
      : '';

  const password =
    typeof input.password === 'string'
      ? input.password
      : '';

  // Kullanıcı adı: 3-30 karakter, İngilizce harf/rakam/alt çizgi.
  if (!username) {
    errors.username = 'Kullanıcı adı zorunludur.';
  } else if (username.length < 3 || username.length > 30) {
    errors.username = 'Kullanıcı adı 3–30 karakter olmalıdır.';
  } else if (!/^[A-Za-z0-9_]+$/.test(username)) {
    errors.username =
      'Yalnızca İngilizce harf, rakam ve alt çizgi kullanın.';
  }

  // E-posta: basit biçim kontrolü ve uzunluk sınırı.
  if (!email) {
    errors.email = 'E-posta zorunludur.';
  } else if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = 'Geçerli bir e-posta adresi girin.';
  }

  // Parola: 12-128 karakter; küçük/büyük harf, rakam ve sembol.
  if (!password) {
    errors.password = 'Parola zorunludur.';
  } else if (password.length < 12 || password.length > 128) {
    errors.password = 'Parola 12–128 karakter olmalıdır.';
  } else if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    errors.password =
      'Parola küçük/büyük harf, rakam ve özel karakter içermelidir.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    // Parola normalleştirilmiş sonuç nesnesine eklenmez.
    normalized: {
      username,
      email
    }
  };
}
