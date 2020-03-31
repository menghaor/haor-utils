import CryptoJS from "crypto-js/crypto-js";

const AES_KEY = "defaultAa123456";
const AES_IV = "123456789";

/**
 * AES加密
 * @param word
 * @param keyStr
 * @param ivStr
 * @returns Base64
 */
export const Encrypt = (word, keyStr = AES_KEY, ivStr = AES_IV) => {
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);

    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

/**
 * AES解密
 * @param word
 * @param keyStr
 * @param ivStr
 * @returns Base64
 */
export const Decrypt = (word, keyStr = AES_KEY, ivStr = AES_IV) => {
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);

    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);

    let decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });

    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};