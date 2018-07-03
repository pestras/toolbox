import * as crypto from 'crypto';

export function hash(src: string, salt?: string): Promise<string | [string, string]> {
  const len = 64;
  const iterations = 10000;
  const digest = 'sha256';

  return new Promise((resolve, reject) => {
    if (salt) {
      crypto.pbkdf2(src, salt, iterations, len, digest, (err: Error, derivedKey: Buffer) => {
        if (err)
          return reject(err);

        resolve(derivedKey.toString('base64'));
      });

    } else {
      crypto.randomBytes(16, (err: Error, saltBuffer: Buffer) => {
        if (err)
          return reject(err);

        salt = saltBuffer.toString('base64');
        crypto.pbkdf2(src, salt, iterations, len, digest, (err: Error, derivedKey: Buffer) => {
          if (err)
            return reject(err);

          resolve([derivedKey.toString('base64'), <string>salt]);
        });
      });
    }
  });
}

export function verify(src: string, hashed: string, salt: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    hash(src, salt)
      .then(hashedSrc => {
        resolve(hashedSrc === hashed);
      })
      .catch(err => reject(err));
  });
}