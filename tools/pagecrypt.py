# -*- coding: utf-8 -*-
"""PageCrypt 解密/加密 —— 只用 /usr/bin/python3，零依赖。

参数取自 light_coder-protected.html 本身：
    salt = bytes[0:32]   iv = bytes[32:48]   ciphertext+tag = bytes[48:]
    PBKDF2-HMAC-SHA256 / 100000 轮 / AES-256-GCM

密码从 stdin 读，不进 argv，所以不会出现在 ps 输出或 shell 历史里。

    python3 pagecrypt.py decrypt <protected.html> <out-plain.html>
    python3 pagecrypt.py encrypt <plain.html>     <protected.html>
"""
import sys, os, re, base64, hashlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import aesgcm

PL_RE = re.compile(r'var pl = "([A-Za-z0-9+/=]+)"')
ITER = 100000


def read_password():
    if sys.stdin.isatty():
        import getpass
        return getpass.getpass('密码: ')
    return sys.stdin.read().rstrip('\r\n')


def main():
    if len(sys.argv) != 4 or sys.argv[1] not in ('decrypt', 'encrypt'):
        sys.stderr.write(__doc__)
        return 2
    mode, a, b = sys.argv[1], sys.argv[2], sys.argv[3]

    pw = read_password()
    if not pw:
        sys.stderr.write('没读到密码。\n')
        return 1
    sys.stderr.write('· 收到密码，长度 %d\n' % len(pw))

    if mode == 'decrypt':
        m = PL_RE.search(open(a, encoding='utf-8').read())
        if not m:
            sys.stderr.write('找不到 pl 载荷\n')
            return 1
        raw = base64.b64decode(m.group(1))
        sys.stderr.write('· 载荷 %d 字节\n' % len(raw))
        salt, iv, body = raw[:32], raw[32:48], raw[48:]
        ct, tag = body[:-16], body[-16:]
        key = hashlib.pbkdf2_hmac('sha256', pw.encode('utf-8'), salt, ITER, 32)
        sys.stderr.write('· 解密中（纯 Python AES，约 1 秒）...\n')
        try:
            out = aesgcm.decrypt(key, iv, ct, tag)
        except ValueError:
            sys.stderr.write('解密失败 — 密码不对\n')
            return 1
        open(b, 'wb').write(out)
        sys.stderr.write('OK 解出 %d 字节 -> %s\n' % (len(out), b))

    else:
        plain = open(a, 'rb').read()
        wrapper = open(b, encoding='utf-8').read()
        if not PL_RE.search(wrapper):
            sys.stderr.write('目标文件里找不到 pl\n')
            return 1
        salt, iv = os.urandom(32), os.urandom(16)
        key = hashlib.pbkdf2_hmac('sha256', pw.encode('utf-8'), salt, ITER, 32)
        sys.stderr.write('· 加密中...\n')
        ct, tag = aesgcm.encrypt(key, iv, plain)
        pl = base64.b64encode(salt + iv + ct + tag).decode('ascii')
        open(b, 'w', encoding='utf-8').write(PL_RE.sub(lambda _: 'var pl = "%s"' % pl, wrapper, count=1))
        sys.stderr.write('OK 已重新加密并写回 %s（明文 %d 字节）\n' % (b, len(plain)))

    return 0


if __name__ == '__main__':
    sys.exit(main())
