
export function validateRegistration({
  username = '',
  email = '',
  password = ''
}) {
  const errors = {};

  const name = username.trim();
  const mail = email.trim();

  if (!name) {
    errors.username = 'Kullanıcı adı zorunludur.';
  } else if (name.length < 3 || name.length > 30) {
    errors.username = 'Kullanıcı adı 3–30 karakter olmalıdır.';
  } else if (!/^[A-Za-z0-9_]+$/.test(name)) {
    errors.username =
      'Yalnızca İngilizce harf, rakam ve alt çizgi kullanın.';
  }

  if (!mail) {
    errors.email = 'E-posta zorunludur.';
  } else if (
    mail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
  ) {
    errors.email = 'Geçerli bir e-posta adresi girin.';
  }

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
    errors,
    normalized: {
      username: name,
      email: mail
    }
  };
}
