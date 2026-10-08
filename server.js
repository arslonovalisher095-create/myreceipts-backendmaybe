const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Database = require("better-sqlite3");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// GOOGLE
// ==========================================

const GOOGLE_CLIENT_ID =
    "386892579592-ud73gcc5qkeo5o05bftevlkbf2df4m20.apps.googleusercontent.com";

const googleClient = new OAuth2Client(
    GOOGLE_CLIENT_ID
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ==========================================
// DATABASE
// ==========================================

const db = new Database("myreceipts.db");

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        picture TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS receipts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        store TEXT,
        date TEXT,
        total REAL,
        category TEXT,
        warranty TEXT,
        items_count INTEGER,
        receipt_data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);

console.log("SQLite база данных подключена");

// ==========================================
// SOLIQ
// ==========================================

const PAYMENT_SECRET =
    "thisIsPaymentSecretKey123@#";

function createSignature(
    terminalId,
    paymentNo,
    timestamp
) {
    const text =
        `${terminalId}:${paymentNo}:${timestamp}`;

    return crypto
        .createHmac(
            "sha256",
            PAYMENT_SECRET
        )
        .update(text, "utf8")
        .digest("hex");
}

// ==========================================
// GOOGLE TOKEN
// ==========================================

async function getGoogleUser(credential) {

    if (!credential) {
        throw new Error(
            "Google credential не передан"
        );
    }

    const ticket =
        await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        });

    const payload =
        ticket.getPayload();

    if (!payload) {
        throw new Error(
            "Не удалось получить данные Google"
        );
    }

    return {
        id: payload.sub,
        name: payload.name || "Пользователь",
        email: payload.email || "",
        picture: payload.picture || ""
    };
}

// ==========================================
// GOOGLE LOGIN
// ==========================================

app.post(
    "/auth/google",
    async (req, res) => {

        try {

            const user =
                await getGoogleUser(
                    req.body.credential
                );

            db.prepare(`
                INSERT INTO users
                (id, name, email, picture)
                VALUES (?, ?, ?, ?)

                ON CONFLICT(id)
                DO UPDATE SET
                    name = excluded.name,
                    email = excluded.email,
                    picture = excluded.picture
            `).run(
                user.id,
                user.name,
                user.email,
                user.picture
            );

            console.log(
                "Google пользователь:",
                user.email
            );

            res.json({
                success: true,
                user: user
            });

        }

        catch (error) {

            console.error(
                "GOOGLE AUTH ERROR:",
                error
            );

            res.status(401).json({
                success: false,
                error:
                    "Не удалось проверить Google аккаунт"
            });
        }
    }
);

// ==========================================
// SAVE RECEIPT
// ==========================================

app.post(
    "/api/receipts",
    async (req, res) => {

        try {

            const {
                credential,
                receipt
            } = req.body;

            const user =
                await getGoogleUser(
                    credential
                );

            if (!receipt) {

                return res.status(400).json({
                    success: false,
                    error: "Чек не передан"
                });

            }

            const company =
                receipt.extraInfo?.companyName ||
                "Неизвестный магазин";

            const total =
                Number(
                    receipt.cashTotal || 0
                );

            const date =
                receipt.paymentDate ||
                "Дата неизвестна";

            const products =
                receipt.paymentDetails || [];

            const category =
                receipt.category ||
                "Другое";

            const warranty =
                receipt.warranty ||
                "—";

            const result =
                db.prepare(`
                    INSERT INTO receipts (
                        user_id,
                        store,
                        date,
                        total,
                        category,
                        warranty,
                        items_count,
                        receipt_data
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    user.id,
                    company,
                    date,
                    total,
                    category,
                    warranty,
                    products.length,
                    JSON.stringify(receipt)
                );

            console.log(
                "Чек сохранён:",
                company,
                "ID:",
                result.lastInsertRowid
            );

            res.json({
                success: true,
                receiptId:
                    result.lastInsertRowid
            });

        }

        catch (error) {

            console.error(
                "SAVE RECEIPT ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
);

// ==========================================
// GET USER RECEIPTS
// ==========================================

app.post(
    "/api/receipts/list",
    async (req, res) => {

        try {

            const user =
                await getGoogleUser(
                    req.body.credential
                );

            const rows =
                db.prepare(`
                    SELECT *
                    FROM receipts
                    WHERE user_id = ?
                    ORDER BY id DESC
                `).all(user.id);

            const receipts =
                rows.map(row => {

                    let originalData = {};

                    try {
                        originalData =
                            JSON.parse(
                                row.receipt_data
                            );
                    }

                    catch {
                        originalData = {};
                    }

                    return {
                        id: row.id,

                        store: row.store,

                        date: row.date,

                        total: row.total,

                        category:
                            row.category,

                        warranty:
                            row.warranty,

                        items:
                            row.items_count,

                        products:
                            originalData.paymentDetails ||
                            [],

                        original:
                            originalData
                    };
                });

            console.log(
                `Загружено чеков: ${receipts.length}`
            );

            res.json({
                success: true,
                receipts: receipts
            });

        }

        catch (error) {

            console.error(
                "LOAD RECEIPTS ERROR:",
                error
            );

            res.status(401).json({
                success: false,
                error:
                    "Не удалось загрузить чеки"
            });
        }
    }
);

// ==========================================
// DELETE RECEIPT
// ==========================================

app.delete(
    "/api/receipts/:id",
    async (req, res) => {

        try {

            const credential =
                req.headers.authorization
                    ?.replace("Bearer ", "");

            const user =
                await getGoogleUser(
                    credential
                );

            const result =
                db.prepare(`
                    DELETE FROM receipts
                    WHERE id = ?
                    AND user_id = ?
                `).run(
                    req.params.id,
                    user.id
                );

            if (result.changes === 0) {

                return res.status(404).json({
                    success: false,
                    error: "Чек не найден"
                });
            }

            res.json({
                success: true
            });

        }

        catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            res.status(401).json({
                success: false,
                error:
                    "Не удалось удалить чек"
            });
        }
    }
);

// ==========================================
// TEST SOLIQ CONNECTION
// ==========================================

app.get(
    "/api/test-soliq",
    async (req, res) => {

        try {

            console.log("");
            console.log(
                "================================"
            );
            console.log(
                "ТЕСТ SOLIQ: начинаем запрос"
            );
            console.log(
                "================================"
            );

            const controller =
                new AbortController();

            const timeout =
                setTimeout(() => {

                    console.log(
                        "ТЕСТ SOLIQ: timeout 15 секунд"
                    );

                    controller.abort();

                }, 15000);

            let response;

            try {

                response =
                    await fetch(
                        "https://new-ofd.soliq.uz/api/payment",
                        {
                            method: "GET",
                            signal:
                                controller.signal
                        }
                    );

            }

            finally {

                clearTimeout(timeout);
            }

            console.log(
                "ТЕСТ SOLIQ STATUS:",
                response.status
            );

            const text =
                await response.text();

            console.log(
                "ТЕСТ SOLIQ RESPONSE:",
                text
            );

            return res.json({

                success: true,

                status:
                    response.status,

                response:
                    text
            });

        }

        catch (error) {

            console.error(
                "ТЕСТ SOLIQ ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    error.message,

                name:
                    error.name,

                code:
                    error.code || null,

                cause:
                    error.cause
                        ? {

                            name:
                                error.cause.name,

                            message:
                                error.cause.message,

                            code:
                                error.cause.code,

                            errno:
                                error.cause.errno,

                            syscall:
                                error.cause.syscall,

                            address:
                                error.cause.address,

                            port:
                                error.cause.port
                        }

                        : null
            });
        }
    }
);

// ==========================================
// SOLIQ — GET CHECK
// ==========================================

app.get(
    "/api/check",
    async (req, res) => {

        try {

            const url =
                req.query.url;

            if (!url) {

                return res.status(400).json({
                    success: false,
                    error:
                        "QR-ссылка не передана"
                });
            }

            console.log("");
            console.log(
                "================================"
            );
            console.log(
                "НОВЫЙ ЗАПРОС ЧЕКА"
            );
            console.log(
                "================================"
            );

            console.log(
                "QR:",
                url
            );

            // ==========================================
            // QR DATA
            // ==========================================

            const qr =
                new URL(url);

            const terminalId =
                qr.searchParams.get("t");

            const paymentNo =
                qr.searchParams.get("r");

            const paymentDate =
                qr.searchParams.get("c");

            const fiscalSign =
                qr.searchParams.get("s");

            console.log(
                "Terminal:",
                terminalId
            );

            console.log(
                "Payment:",
                paymentNo
            );

            console.log(
                "Date:",
                paymentDate
            );

            console.log(
                "Fiscal:",
                fiscalSign
            );

            if (
                !terminalId ||
                !paymentNo ||
                !paymentDate ||
                !fiscalSign
            ) {

                return res.status(400).json({
                    success: false,
                    error:
                        "Не удалось прочитать данные QR-кода"
                });
            }

            // ==========================================
            // TIMESTAMP
            // ==========================================

            const timestamp =
                Math.floor(
                    Date.now() / 1000
                );

            // ==========================================
            // SIGNATURE
            // ==========================================

            const signature =
                createSignature(
                    terminalId,
                    paymentNo,
                    timestamp
                );

            // ==========================================
            // BODY
            // ==========================================

            const body = {

                terminalId:
                    terminalId,

                paymentNo:
                    paymentNo,

                paymentDate:
                    paymentDate,

                fiscalSign:
                    fiscalSign,

                paymentType:
                    "CHECK"
            };

            console.log(
                "Soliq body:",
                JSON.stringify(body)
            );

            console.log(
                "Отправляем запрос в Soliq..."
            );

            // ==========================================
            // FETCH
            // ==========================================

            const controller =
                new AbortController();

            const timeout =
                setTimeout(() => {

                    console.error(
                        "Soliq timeout: 30 секунд"
                    );

                    controller.abort();

                }, 30000);

            let response;

            try {

                response =
                    await fetch(
                        "https://new-ofd.soliq.uz/api/payment",
                        {

                            method: "POST",

                            headers: {

                                "Accept":
                                    "application/json",

                                "Content-Type":
                                    "application/json",

                                "Origin":
                                    "https://ofd.soliq.uz",

                                "Referer":
                                    "https://ofd.soliq.uz/",

                                "X-Timestamp":
                                    String(timestamp),

                                "X-Signature":
                                    signature
                            },

                            body:
                                JSON.stringify(body),

                            signal:
                                controller.signal
                        }
                    );

            }

            finally {

                clearTimeout(timeout);
            }

            console.log(
                "Soliq HTTP:",
                response.status
            );

            // ==========================================
            // RESPONSE
            // ==========================================

            const responseText =
                await response.text();

            console.log(
                "Soliq RAW RESPONSE:",
                responseText
            );

            let data;

            try {

                data =
                    JSON.parse(
                        responseText
                    );

            }

            catch {

                data = {
                    message:
                        responseText
                };
            }

            console.log(
                "Soliq DATA:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            // ==========================================
            // SOLIQ ERROR
            // ==========================================

            if (!response.ok) {

                return res
                    .status(response.status)
                    .json({

                        success: false,

                        error:
                            data.message ||
                            `Soliq HTTP ${response.status}`,

                        soliq:
                            data
                    });
            }

            // ==========================================
            // SUCCESS
            // ==========================================

            return res.json({

                success: true,

                receipt:
                    data.data,

                message:
                    data.message
            });

        }

        catch (error) {

            console.error(
                "ОШИБКА SOLIQ:",
                error
            );

            console.error(
                "ERROR NAME:",
                error.name
            );

            console.error(
                "ERROR MESSAGE:",
                error.message
            );

            console.error(
                "ERROR CODE:",
                error.code
            );

            console.error(
                "ERROR CAUSE:",
                error.cause
            );

            // ==========================================
            // TIMEOUT
            // ==========================================

            if (
                error.name ===
                "AbortError"
            ) {

                return res.status(504).json({

                    success: false,

                    error:
                        "Soliq не ответил за 30 секунд",

                    details:
                        "Timeout при подключении к new-ofd.soliq.uz"
                });
            }

            // ==========================================
            // FETCH ERROR
            // ==========================================

            return res.status(500).json({

                success: false,

                error:
                    error.message,

                name:
                    error.name,

                code:
                    error.code || null,

                cause:
                    error.cause
                        ? {

                            name:
                                error.cause.name,

                            message:
                                error.cause.message,

                            code:
                                error.cause.code,

                            errno:
                                error.cause.errno,

                            syscall:
                                error.cause.syscall,

                            address:
                                error.cause.address,

                            port:
                                error.cause.port
                        }

                        : null
            });
        }
    }
);

// ==========================================
// HOME
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.send(
            "MyReceipts server работает!"
        );
    }
);

// ==========================================
// START
// ==========================================

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "================================"
        );

        console.log(
            "MyReceipts server запущен!"
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            `http://localhost:${PORT}/login.html`
        );

        console.log(
            "SQLite: myreceipts.db"
        );

        console.log(
            "================================"
        );
    }
);