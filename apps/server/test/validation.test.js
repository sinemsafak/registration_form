
import { describe, it, expect } from 'vitest';
import { validateRegistration } from '../src/validation.js';

const validInput = {
  username: 'demo_user',
  email: 'demo@example.com',
  password: 'GoodPassword9!'
};

describe('validateRegistration', () => {
  it('geçerli alanları kabul eder', () => {
    const result = validateRegistration(validInput);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('boş alanları reddeder', () => {
    const result = validateRegistration({
      username: ' ',
      email: '',
      password: ''
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('username');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
  });

  it('hatalı e-posta biçimini reddeder', () => {
    const result = validateRegistration({
      ...validInput,
      email: 'gecersiz'
    });

    expect(result.errors).toHaveProperty('email');
  });

  it('çok kısa parolayı reddeder', () => {
    const result = validateRegistration({
      ...validInput,
      password: 'Ab1!'
    });

    expect(result.errors).toHaveProperty('password');
  });

  it('parola karmaşıklığını kontrol eder', () => {
    const result = validateRegistration({
      ...validInput,
      password: 'alllowercase123!'
    });

    expect(result.errors).toHaveProperty('password');
  });

  it('çok uzun kullanıcı adını reddeder', () => {
    const result = validateRegistration({
      ...validInput,
      username: 'a'.repeat(31)
    });

    expect(result.errors).toHaveProperty('username');
  });

  it('çok uzun e-postayı reddeder', () => {
    const result = validateRegistration({
      ...validInput,
      email: `${'a'.repeat(250)}@example.com`
    });

    expect(result.errors).toHaveProperty('email');
  });

  it('kullanıcı adı ve e-postayı trim eder', () => {
    const result = validateRegistration({
      username: ' demo_user ',
      email: ' demo@example.com ',
      password: validInput.password
    });

    expect(result.valid).toBe(true);
    expect(result.normalized.username).toBe('demo_user');
    expect(result.normalized.email).toBe('demo@example.com');
    expect(result.normalized).not.toHaveProperty('password');
  });

  it('parolayı hata mesajlarına eklemez', () => {
    const secret = 'SENSITIVE_VALUE';

    const result = validateRegistration({
      username: 'x',
      email: 'gecersiz',
      password: secret
    });

    expect(JSON.stringify(result.errors)).not.toContain(secret);
  });

  it('nesne olmayan istekleri reddeder', () => {
    const result = validateRegistration(null);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('form');
  });
});
