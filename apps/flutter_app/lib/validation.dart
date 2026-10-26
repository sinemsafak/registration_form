
class RegistrationValidation {
  static Map<String, String> validate({
    required String username,
    required String email,
    required String password,
  }) {
    final errors = <String, String>{};

    final name = username.trim();
    final mail = email.trim();

    if (name.isEmpty) {
      errors['username'] = 'Kullanıcı adı zorunludur.';
    } else if (name.length < 3 || name.length > 30) {
      errors['username'] =
          'Kullanıcı adı 3–30 karakter olmalıdır.';
    } else if (!RegExp(r'^[A-Za-z0-9_]+$').hasMatch(name)) {
      errors['username'] =
          'Yalnızca İngilizce harf, rakam ve alt çizgi kullanın.';
    }

    if (mail.isEmpty) {
      errors['email'] = 'E-posta zorunludur.';
    } else if (
      mail.length > 254 ||
      !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(mail)
    ) {
      errors['email'] = 'Geçerli bir e-posta adresi girin.';
    }

    if (password.isEmpty) {
      errors['password'] = 'Parola zorunludur.';
    } else if (password.length < 12 || password.length > 128) {
      errors['password'] = 'Parola 12–128 karakter olmalıdır.';
    } else if (
      !RegExp(r'[a-z]').hasMatch(password) ||
      !RegExp(r'[A-Z]').hasMatch(password) ||
      !RegExp(r'[0-9]').hasMatch(password) ||
      !RegExp(r'[^A-Za-z0-9]').hasMatch(password)
    ) {
      errors['password'] =
          'Parola küçük/büyük harf, rakam ve özel karakter içermelidir.';
    }

    return errors;
  }
}
