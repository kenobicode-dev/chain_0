// Подключаем встроенный модуль Node.js для работы с криптографией
// const crypto = require('crypto');
import crypto from "crypto";


/**
 * Класс POW (Proof Of Work)
 * Реализует упрощённую логику майнинга блока:
 * - создание заголовка блока,
 * - вычисление target,
 * - перебор nonce,
 * - проверку SHA-256 хеша.
 */
export default class POW {

    /**
     * Конструктор класса
     * @param {number} version - версия блока
     * @param {string} previousBlockHash - хеш предыдущего блока
     * @param {string} merkleRoot - Merkle Root транзакций
     * @param {number} timeStamp - время создания блока
     * @param {number} difficultyTarget - сложность сети (bits)
     */
    constructor(
        version,
        previousBlockHash,
        merkleRoot,
        timeStamp,
        difficultyTarget
    ) {

        // Версия блока
        this.version = version;

        // Хеш предыдущего блока
        this.previousBlockHash = previousBlockHash;

        // Корень дерева Меркла
        this.merkleRoot = merkleRoot;

        // Timestamp блока
        this.timeStamp = timeStamp;

        // Параметр сложности сети
        this.difficultyTarget = difficultyTarget;
    }


    /**
     * Перевод hexadecimal строки в decimal число
     * Пример:
     * "ff" => 255
     *
     * @param {string} x - hex строка
     * @returns {number}
     */
    hTod(x) {

        // Текущий символ
        let b = '';

        // Позиция степени 16
        let p = 0;

        // Значение hex символа
        let hexS = 0;

        // Итоговое decimal число
        let res = 0;

        // Пока строка не пустая
        while (x != '') {

            // Берём символ с конца строки
            b = x[x.length - 1];

            // Удаляем последний символ
            x = x.slice(0, -1);

            // Если символ является буквой hex формата
            if (
                (b >= 'a' && b <= 'z') ||
                (b >= 'A' && b <= 'Z')
            ) {

                // Получаем decimal значение буквы
                hexS = this.hexaabcdef(b);

            } else {

                // Иначе это обычная цифра
                hexS = Number(b);
            }

            // Добавляем значение:
            // digit * 16^position
            res += Math.pow(16, p) * hexS;

            // Увеличиваем степень
            p += 1;
        }

        return res;
    }


    /**
     * Перевод hex букв в decimal:
     * a => 10
     * b => 11
     * ...
     * f => 15
     *
     * @param {string} x
     * @returns {number}
     */
    hexaabcdef(x) {

        if (x == 'a' || x == 'A') {

            return 10;

        } else if (x == 'b' || x == 'B') {

            return 11;

        } else if (x == 'c' || x == 'C') {

            return 12;

        } else if (x == 'd' || x == 'D') {

            return 13;

        } else if (x == 'e' || x == 'E') {

            return 14;

        } else if (x == 'f' || x == 'F') {

            return 15;

        } else {

            // Обработка неправильного символа
            try {

                throw new TypeError(
                    "Not a proper hexadecimal character"
                );

            } catch (err) {

                // console.log(err);

                console.log(
                    "Введите корректные данные!"
                );
            }
        }
    }


    /**
     * Создание block header размером 80 байт
     *
     * Структура:
     * 4  bytes - version
     * 32 bytes - previous block hash
     * 32 bytes - merkle root
     * 4  bytes - timestamp
     * 4  bytes - difficulty target
     * 4  bytes - nonce (добавляется позже)
     *
     * @returns {Buffer}
     */
    theKey() {

        // Выделяем память под 80 байт
        const blockHeader = Buffer.alloc(80);

        /**
         * writeUInt32LE(value, offset)
         * LE = Little Endian
         *
         * Записываем version в первые 4 байта
         */
        blockHeader.writeUInt32LE(this.version, 0);

        /**
         * Buffer.from(..., 'hex')
         * Создаём Buffer из hex строки
         *
         * reverse()
         * храним hash в reverse byte order
         *
         * copy(destination, offset)
         * Копируем данные в blockHeader
         */
        Buffer
            .from(this.previousBlockHash, 'hex')
            .reverse()
            .copy(blockHeader, 4);

        /**
         * Merkle Root занимает следующие 32 байта
         * Начинается с позиции 36:
         * 4 + 32 = 36
         */
        Buffer
            .from(this.merkleRoot, 'hex')
            .reverse()
            .copy(blockHeader, 36);

        /**
         * Timestamp записываем с позиции 68:
         * 36 + 32 = 68
         */
        blockHeader.writeUInt32LE(
            this.timeStamp,
            68
        );

        /**
         * Difficulty target записываем с позиции 72
         */
        blockHeader.writeUInt32LE(
            this.difficultyTarget,
            72
        );

        // Возвращаем готовый заголовок
        return blockHeader;
    }


    /**
     * Вычисление target из difficultyTarget (bits)
     *
     * Формула:
     * target = coefficient * 2^(8 * (exponent - 3))
     *
     * @returns {BigInt}
     */
    target() {

        // difficultyTarget в hex формате
        let targetEle = "";

        // Первые 2 символа (экспонента)
        let firstTwoEle = "";

        // Значение степени
        let exp = 0;

        // Коэффициент
        let coefficientEle = "";

        // Итоговый target
        let targetValue = 0;

        // Перевод числа в hex строку
        targetEle = this.difficultyTarget.toString(16);

        /**
         * Первые 2 hex символа
         * используются как exponent
         */
        firstTwoEle = targetEle.slice(0, 2);

        // Перевод exponent в decimal
        firstTwoEle = Number(
            this.hTod(firstTwoEle)
        );

        /**
         * Остальные символы — coefficient
         */
        coefficientEle = targetEle.slice(
            2,
            targetEle.length
        );

        /**
         * Формула степени:
         * 8 * (exponent - 3)
         */
        exp = 8 * (firstTwoEle - 3);

        /**
         * Вычисление итогового target
         */
        targetValue =
            BigInt(this.hTod(coefficientEle)) *
            BigInt(Math.pow(2, exp));

        return targetValue;
    }


    /**
     * Проверка:
     * hash <= target ?
     *
     * @param {string} hash - hex hash
     * @param {BigInt} target
     * @returns {boolean}
     */
    isValidHash(hash, target) {

        // Переводим hash в Buffer
        const hashBuffer = Buffer.from(hash, 'hex');

        /**
         * Reverse нужен из-за little endian
         */
        const hashInt = BigInt(
            '0x' +
            hashBuffer
                .reverse()
                .toString('hex')
        );

        // Хеш считается валидным если <= target
        return hashInt <= target;
    }


    /**
     * Майнинг:
     * Перебираем nonce пока не найдём валидный hash
     *
     * @param {Buffer} header
     * @param {BigInt} target
     * @returns {object|null}
     */
    theComparatorForMiner(header, target) {

        /**
         * Максимальный nonce:
         * 2^32
         *
         * Потому что nonce занимает 4 байта
         */
        const maxNonce = 2 ** 32;

        /**
         * Перебор nonce
         */
        for (let nonce = 0; nonce < maxNonce; nonce++) {

            // Создаём Buffer на 4 байта
            const nonceBuffer = Buffer.alloc(4);

            // Записываем nonce
            nonceBuffer.writeUInt32LE(nonce, 0); // + Buffer на ? байт (maybe BUG) !!!

            /**
             * Добавляем nonce к header
             */
            const headerWithNonce = Buffer.concat([
                header,
                nonceBuffer
            ]);

            /**
             * используем double SHA-256
             */
            const hashResult = this.sha256(
                this.sha256(headerWithNonce)
            );

            // Выводим текущий hash
            console.log(hashResult);

            /**
             * Проверяем валидность hash
             */
            if (this.isValidHash(hashResult, target)) {
                // Возвращаем найденный nonce
                return {
                    nonce,
                    hashResult:
                        hashResult.toString('hex')
                };
            }
        }

        // Если nonce не найден
        return null;
    }


    /**
     * SHA-256 хеширование
     *
     * @param {Buffer|string} data
     * @returns {string}
     */
    sha256(data) {

        return crypto
            .createHash('sha256')
            .update(data)
            .digest('hex');
    }
}


/**
 * Исходные данные блока
 */

// Версия блока
// const version = 0x20000000;

// Хеш предыдущего блока
// const prevBlockHash =
    // '0000000000000000000769c0f55d1ed7d45b8c7b94e6780a6f8e1b682a35c427';

// Merkle Root
// const merkleRoot =
    // '7f8c0b6467e7c6465c8f8b1e5b94707e9c8b2c2d6182d8b1e9d8b2d1d2c7c827';

// Timestamp
// const timestamp = 0x5d14a0b4;
// const timestamp = Math.floor(Date.now() / 1000);

// Difficulty target (bits)
// const difficultyTarget = 0x207fffff;
// Для теста используй лёгкую сложность:
// const difficultyTarget = 0x207fffff;


/**
 * Создание объекта класса POW
 */
// let SHA256 = new POW(
//     version,
//     prevBlockHash,
//     merkleRoot,
//     timestamp,
//     difficultyTarget
// );


/**
 * Создание block header
 */
// let header = SHA256.theKey();


/**
 * Вычисление target
 */
// let target = SHA256.target();


/**
 * Запуск майнинга
 */
// const result = SHA256.theComparatorForMiner(
//     header,
//     target
// );


/**
 * Вывод результата
 */
// if (result) {

//     console.log(
//         `Valid   found: ${result.nonce}`
//     );

//     console.log(
//         `Hash: ${result.hashResult}`
//     );

// } else {

//     console.log(
//         'No valid nonce found. Проверьте цикл, target или код.'
//     );
// }