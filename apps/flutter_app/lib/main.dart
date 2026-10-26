
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'validation.dart';

void main() {
  runApp(const RegistrationApp());
}

class RegistrationApp extends StatelessWidget {
  const RegistrationApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'registration_form',
      theme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
      ),
      home: const RegistrationPage(),
    );
  }
}

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({super.key});

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final _formKey = GlobalKey<FormState>();

  final _username = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();

  bool _busy = false;
  String? _status;

  // Android emülatörü, geliştirme bilgisayarına 10.0.2.2 ile ulaşır.
  // Başka cihazlarda --dart-define ile adresi değiştirebilirsin.
  static const _apiBase = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000',
  );

  String? _fieldError(String field) {
    return RegistrationValidation.validate(
      username: _username.text,
      email: _email.text,
      password: _password.text,
    )[field];
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _busy = true;
      _status = null;
    });

    try {
      final response = await http.post(
        Uri.parse('$_apiBase/api/register'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'username': _username.text.trim(),
          'email': _email.text.trim(),
          'password': _password.text,
        }),
      );

      dynamic decoded;

      try {
        decoded = jsonDecode(response.body);
      } on FormatException {
        setState(() {
          _status = 'Sunucudan geçerli bir yanıt alınamadı.';
        });
        return;
      }

      if (decoded is! Map<String, dynamic>) {
        setState(() {
          _status = 'Sunucudan beklenmeyen bir yanıt alındı.';
        });
        return;
      }

      if (response.statusCode >= 200 &&
          response.statusCode < 300) {
        _username.clear();
        _email.clear();
        _password.clear();

        setState(() {
          _status = decoded['message'] as String? ??
              'İşlem başarılı.';
        });
      } else {
        final rawErrors = decoded['errors'];
        final serverErrors = <String, String>{};

        if (rawErrors is Map) {
          for (final entry in rawErrors.entries) {
            if (entry.key is String && entry.value is String) {
              serverErrors[entry.key as String] =
                  entry.value as String;
            }
          }
        }

        setState(() {
          _status = decoded['message'] as String? ??
              'Alanları kontrol edin.';
        });

        if (serverErrors.isNotEmpty) {
          // Sunucu hataları form alanlarına yansıtılır.
          // Parola veya form gövdesi loglanmaz.
          setState(() {
            _serverErrors
              ..clear()
              ..addAll(serverErrors);
          });
          _formKey.currentState!.validate();
        }
      }
    } catch (_) {
      setState(() {
        _status =
            'Sunucuya bağlanılamadı. API adresini kontrol edin.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _busy = false;
        });
      }
    }
  }

  final Map<String, String> _serverErrors = {};

  String? _validator(String field) {
    return _serverErrors[field] ?? _fieldError(field);
  }

  @override
  void dispose() {
    _username.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('registration_form'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 440),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Kayıt formu',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20),

                  TextFormField(
                    controller: _username,
                    maxLength: 10000,
                    autocorrect: false,
                    decoration: const InputDecoration(
                      labelText: 'Kullanıcı adı',
                      border: OutlineInputBorder(),
                    ),
                    validator: (_) => _validator('username'),
                    onChanged: (_) {
                      setState(() {
                        _serverErrors.remove('username');
                        _status = null;
                      });
                    },
                  ),

                  const SizedBox(height: 12),

                  TextFormField(
                    controller: _email,
                    maxLength: 10000,
                    keyboardType: TextInputType.emailAddress,
                    autocorrect: false,
                    decoration: const InputDecoration(
                      labelText: 'E-posta',
                      border: OutlineInputBorder(),
                    ),
                    validator: (_) => _validator('email'),
                    onChanged: (_) {
                      setState(() {
                        _serverErrors.remove('email');
                        _status = null;
                      });
                    },
                  ),

                  const SizedBox(height: 12),

                  TextFormField(
                    controller: _password,
                    maxLength: 10000,
                    obscureText: true,
                    autocorrect: false,
                    enableSuggestions: false,
                    decoration: const InputDecoration(
                      labelText: 'Parola',
                      helperText:
                          '12–128 karakter; küçük/büyük harf, rakam ve özel karakter.',
                      border: OutlineInputBorder(),
                    ),
                    validator: (_) => _validator('password'),
                    onChanged: (_) {
                      setState(() {
                        _serverErrors.remove('password');
                        _status = null;
                      });
                    },
                  ),

                  const SizedBox(height: 16),

                  FilledButton(
                    onPressed: _busy ? null : _submit,
                    child: Text(
                      _busy ? 'Kontrol ediliyor…' : 'Kayıt ol',
                    ),
                  ),

                  if (_status != null) ...[
                    const SizedBox(height: 16),
                    Semantics(
                      liveRegion: true,
                      child: Text(_status!),
                    ),
                  ],

                  const SizedBox(height: 12),

                  const Text(
                    'Demo sürümünde hesap oluşturulmaz. '
                    'Parola ve form değerleri loglara yazdırılmaz.',
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
