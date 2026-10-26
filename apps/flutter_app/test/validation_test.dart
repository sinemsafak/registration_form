
import 'package:flutter_test/flutter_test.dart';
import 'package:registration_form/validation.dart';

void main() {
  test('geçerli girdiler kabul edilir', () {
    final errors = RegistrationValidation.validate(
      username: 'demo_user',
      email: 'demo@example.com',
      password: 'GoodPassword9!',
    );

    expect(errors, isEmpty);
  });

  test('boş ve hatalı girdiler reddedilir', () {
    final errors = RegistrationValidation.validate(
      username: ' ',
      email: 'yanlis',
      password: 'short',
    );

    expect(
      errors.keys,
      containsAll(['username', 'email', 'password']),
    );
  });

  test('çok uzun kullanıcı adı reddedilir', () {
    final errors = RegistrationValidation.validate(
      username: 'a' * 31,
      email: 'demo@example.com',
      password: 'GoodPassword9!',
    );

    expect(errors.containsKey('username'), isTrue);
  });

  test('çok uzun e-posta reddedilir', () {
    final errors = RegistrationValidation.validate(
      username: 'demo_user',
      email: '${'a' * 250}@example.com',
      password: 'GoodPassword9!',
    );

    expect(errors.containsKey('email'), isTrue);
  });

  test('parola kenar boşluklarını otomatik silmez', () {
    final errors = RegistrationValidation.validate(
      username: 'demo_user',
      email: 'demo@example.com',
      password: ' GoodPassword9! ',
    );

    expect(errors, isEmpty);
  });

  test('parola 128 karakterden uzunsa reddedilir', () {
    final errors = RegistrationValidation.validate(
      username: 'demo_user',
      email: 'demo@example.com',
      password: 'A1!${'a' * 126}',
    );

    expect(errors.containsKey('password'), isTrue);
  });
}
