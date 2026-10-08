// ==========================================
// MyReceipts
// FULL SCRIPT.JS
// Google + SQLite + Soliq + QR Scanner
// Language RU / UZ / EN
// Account Settings + Profile
// Delete confirmation
// Product Icons
// Receipt Date Groups
// ==========================================


// ==========================================
// AUTHORIZATION
// ==========================================

const savedUser =
    localStorage.getItem("myReceiptsUser");

const savedCredential =
    localStorage.getItem("googleCredential");


if (!savedUser || !savedCredential) {
    window.location.href = "login.html";
}


// ==========================================
// ELEMENTS
// ==========================================

// Receipt
const addReceiptBtn =
    document.getElementById("addReceiptBtn");

const cameraModal =
    document.getElementById("cameraModal");

const closeCamera =
    document.getElementById("closeCamera");

const cancelCamera =
    document.getElementById("cancelCamera");

const scanReceipt =
    document.getElementById("scanReceipt");

const cameraStatus =
    document.getElementById("cameraStatus");

const qrResult =
    document.getElementById("ocrResult");

const receiptList =
    document.getElementById("receiptList");


// Receipt panel
const receiptPanel =
    document.getElementById("receiptSidePanel");

const closeReceiptPanel =
    document.getElementById("closeReceiptPanel");

const deleteReceiptBtn =
    document.getElementById("deleteReceipt");


// Account
const accountButton =
    document.getElementById("accountButton");

const accountMenu =
    document.getElementById("accountMenu");

const logoutButton =
    document.getElementById("logoutButton");

const settingsLogoutButton =
    document.getElementById("settingsLogoutButton");

const accountSettings =
    document.getElementById("accountSettings");

const accountProfile =
    document.getElementById("accountProfile");


// Account settings
const accountSettingsOverlay =
    document.getElementById("accountSettingsOverlay");

const closeAccountSettings =
    document.getElementById("closeAccountSettings");


// Profile
const accountProfileOverlay =
    document.getElementById("accountProfileOverlay");

const closeAccountProfile =
    document.getElementById("closeAccountProfile");


// Language
const languageSelect =
    document.getElementById("languageSelect");

const languageDropdown =
    document.getElementById("languageDropdown");

const languageSelected =
    document.getElementById("languageSelected");

const languageOptions =
    document.querySelectorAll(".language-option");

const selectedFlag =
    document.getElementById("selectedFlag");

const selectedLanguage =
    document.getElementById("selectedLanguage");


// Delete confirmation
const deleteConfirmOverlay =
    document.getElementById("deleteConfirmOverlay");

const deleteCancelBtn =
    document.getElementById("deleteCancelBtn");

const deleteConfirmBtn =
    document.getElementById("deleteConfirmBtn");


// ==========================================
// VARIABLES
// ==========================================

let scanner = null;

let scanning = false;

let qrAlreadyFound = false;

let currentReceiptId = null;

let currentReceiptElement = null;


// ==========================================
// GOOGLE CREDENTIAL
// ==========================================

function getGoogleCredential() {

    return localStorage.getItem(
        "googleCredential"
    );

}


// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {

    const savedUser =
        localStorage.getItem(
            "myReceiptsUser"
        );

    if (!savedUser) {
        return null;
    }

    try {

        return JSON.parse(
            savedUser
        );

    }

    catch (error) {

        console.error(
            "Ошибка чтения пользователя:",
            error
        );

        return null;

    }

}


// ==========================================
// CHECK LOGIN
// ==========================================

function checkLogin() {

    const user =
        localStorage.getItem(
            "myReceiptsUser"
        );

    const credential =
        localStorage.getItem(
            "googleCredential"
        );


    if (!user || !credential) {

        console.log(
            "Пользователь не авторизован"
        );

        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


// ==========================================
// PAGE START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "================================"
        );

        console.log(
            "MyReceipts запущен"
        );

        console.log(
            "================================"
        );


        if (!checkLogin()) {
            return;
        }


        loadGoogleUser();

        loadAccountMenu();

        loadAccountProfile();

        loadSavedLanguage();

        await loadSavedReceipts();

    }
);


// ==========================================
// ACCOUNT MENU
// ==========================================

if (
    accountButton &&
    accountMenu
) {

    accountButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            accountMenu.classList.toggle(
                "open"
            );

        }
    );


    accountMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    document.addEventListener(
        "click",
        () => {

            accountMenu.classList.remove(
                "open"
            );

        }
    );

}


// ==========================================
// OPEN ACCOUNT SETTINGS
// ==========================================

if (
    accountSettings &&
    accountSettingsOverlay
) {

    accountSettings.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (accountMenu) {

                accountMenu.classList.remove(
                    "open"
                );

            }


            if (accountProfileOverlay) {

                accountProfileOverlay.classList.remove(
                    "active"
                );

            }


            accountSettingsOverlay.classList.add(
                "active"
            );


            loadAccountProfile();

        }
    );

}


// ==========================================
// CLOSE ACCOUNT SETTINGS
// ==========================================

if (
    closeAccountSettings &&
    accountSettingsOverlay
) {

    closeAccountSettings.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            accountSettingsOverlay.classList.remove(
                "active"
            );

        }
    );

}


// ==========================================
// CLOSE SETTINGS BY BACKGROUND
// ==========================================

if (accountSettingsOverlay) {

    accountSettingsOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                accountSettingsOverlay
            ) {

                accountSettingsOverlay.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// PROFILE BUTTON
// ==========================================

if (
    accountProfile &&
    accountProfileOverlay
) {

    accountProfile.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (accountMenu) {

                accountMenu.classList.remove(
                    "open"
                );

            }


            if (accountSettingsOverlay) {

                accountSettingsOverlay.classList.remove(
                    "active"
                );

            }


            loadAccountProfile();


            accountProfileOverlay.classList.add(
                "active"
            );

        }
    );

}


// ==========================================
// CLOSE PROFILE
// ==========================================

if (
    closeAccountProfile &&
    accountProfileOverlay
) {

    closeAccountProfile.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            accountProfileOverlay.classList.remove(
                "active"
            );

        }
    );

}


// ==========================================
// PROFILE BACKGROUND
// ==========================================

if (accountProfileOverlay) {

    accountProfileOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                accountProfileOverlay
            ) {

                accountProfileOverlay.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    console.log(
        "Выход из аккаунта..."
    );


    localStorage.removeItem(
        "myReceiptsUser"
    );


    localStorage.removeItem(
        "googleCredential"
    );


    localStorage.removeItem(
        "currentUser"
    );


    try {

        if (
            typeof google !== "undefined" &&
            google.accounts &&
            google.accounts.id
        ) {

            google.accounts.id.disableAutoSelect();

        }

    }

    catch (error) {

        console.log(
            "Google logout:",
            error
        );

    }


    window.location.href =
        "login.html";

}


// ==========================================
// LOGOUT BUTTONS
// ==========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


if (settingsLogoutButton) {

    settingsLogoutButton.addEventListener(
        "click",
        logout
    );

}


// ==========================================
// LOAD GOOGLE USER
// ==========================================

function loadGoogleUser() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    console.log(
        "Пользователь:",
        user
    );


    const userName =
        document.getElementById(
            "userName"
        );

    const userEmail =
        document.getElementById(
            "userEmail"
        );

    const userAvatar =
        document.getElementById(
            "userAvatar"
        );


    if (userName) {

        userName.textContent =
            user.name ||
            user.username ||
            "Пользователь";

    }


    if (userEmail) {

        userEmail.textContent =
            user.email ||
            "Google аккаунт";

    }


    setAvatar(
        userAvatar,
        user
    );

}


// ==========================================
// LOAD ACCOUNT MENU
// ==========================================

function loadAccountMenu() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    const menuName =
        document.getElementById(
            "menuUserName"
        );

    const menuEmail =
        document.getElementById(
            "menuUserEmail"
        );

    const menuAvatar =
        document.getElementById(
            "menuUserAvatar"
        );


    if (menuName) {

        menuName.textContent =
            user.name ||
            user.username ||
            "Пользователь";

    }


    if (menuEmail) {

        menuEmail.textContent =
            user.email ||
            "Google аккаунт";

    }


    setAvatar(
        menuAvatar,
        user
    );

}


// ==========================================
// LOAD ACCOUNT PROFILE
// ==========================================

function loadAccountProfile() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        console.log(
            "Текущий аккаунт не найден."
        );

        return;

    }


    const name =
        currentUser.name ||
        currentUser.username ||
        "Пользователь";


    const email =
        currentUser.email ||
        "Email не указан";


    const profileUserName =
        document.getElementById(
            "profileUserName"
        );


    const profileUserEmail =
        document.getElementById(
            "profileUserEmail"
        );


    const profileUserAvatar =
        document.getElementById(
            "profileUserAvatar"
        );


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    if (profileUserName) {

        profileUserName.textContent =
            name;

    }


    if (profileUserEmail) {

        profileUserEmail.textContent =
            email;

    }


    if (profileName) {

        profileName.textContent =
            name;

    }


    if (profileEmail) {

        profileEmail.textContent =
            email;

    }


    if (profileUserAvatar) {

        setAvatar(
            profileUserAvatar,
            currentUser
        );

    }

}


// ==========================================
// SET AVATAR
// ==========================================

function setAvatar(
    element,
    user
) {

    if (!element) {
        return;
    }


    const picture =
        user?.picture ||
        user?.avatar;


    if (picture) {

        if (
            element.tagName &&
            element.tagName.toLowerCase() === "img"
        ) {

            element.src =
                picture;

            element.alt =
                "Avatar";

            element.referrerPolicy =
                "no-referrer";

            element.onerror = () => {

                element.removeAttribute(
                    "src"
                );

                element.alt =
                    getInitials(
                        user?.name
                    );

            };

            return;

        }


        const img =
            document.createElement(
                "img"
            );


        img.src =
            picture;


        img.alt =
            "Avatar";


        img.referrerPolicy =
            "no-referrer";


        img.onerror = () => {

            element.innerHTML = "";

            element.textContent =
                getInitials(
                    user?.name
                );

        };


        element.innerHTML = "";

        element.appendChild(
            img
        );

        return;

    }


    if (
        element.tagName &&
        element.tagName.toLowerCase() === "img"
    ) {

        element.removeAttribute(
            "src"
        );

        element.alt =
            getInitials(
                user?.name
            );

        return;

    }


    element.innerHTML = "";

    element.textContent =
        getInitials(
            user?.name
        );

}


// ==========================================
// INITIALS
// ==========================================

function getInitials(name) {

    if (!name) {
        return "А";
    }


    const parts =
        String(name)
            .trim()
            .split(/\s+/);


    if (parts.length >= 2) {

        return (
            parts[0].charAt(0) +
            parts[1].charAt(0)
        ).toUpperCase();

    }


    return parts[0]
        .charAt(0)
        .toUpperCase();

}


// ==========================================
// OPEN CAMERA
// ==========================================

if (addReceiptBtn) {

    addReceiptBtn.addEventListener(
        "click",
        () => {

            if (!cameraModal) {
                return;
            }


            cameraModal.classList.add(
                "show"
            );


            if (cameraStatus) {

                cameraStatus.textContent =
                    "Нажмите «Сканировать чек»";

            }


            if (qrResult) {

                qrResult.innerHTML =
                    "";

            }


            qrAlreadyFound =
                false;

        }
    );

}


// ==========================================
// START QR SCANNER
// ==========================================

if (scanReceipt) {

    scanReceipt.addEventListener(
        "click",
        async () => {

            console.log(
                "СКАНИРОВАНИЕ ЗАПУЩЕНО"
            );


            if (
                typeof Html5Qrcode ===
                "undefined"
            ) {

                console.error(
                    "Html5Qrcode не найден"
                );


                if (cameraStatus) {

                    cameraStatus.textContent =
                        "QR-библиотека не загрузилась";

                }

                return;

            }


            if (scanning) {

                console.log(
                    "Сканер уже работает"
                );

                return;

            }


            qrAlreadyFound =
                false;

            scanning =
                true;


            if (cameraStatus) {

                cameraStatus.textContent =
                    "Наведите камеру на QR-код";

            }


            try {

                scanner =
                    new Html5Qrcode(
                        "reader"
                    );


                await scanner.start(

                    {
                        facingMode:
                            "environment"
                    },

                    {
                        fps: 10,

                        qrbox: {
                            width: 250,
                            height: 250
                        },

                        aspectRatio: 1.0

                    },

                    async decodedText => {

                        if (
                            qrAlreadyFound
                        ) {

                            return;

                        }


                        qrAlreadyFound =
                            true;


                        console.log(
                            "QR-КОД НАЙДЕН:",
                            decodedText
                        );


                        if (qrResult) {

                            qrResult.innerHTML =
                                "<strong>QR-код найден!</strong><br><br>" +
                                escapeHtml(
                                    decodedText
                                );

                        }


                        if (cameraStatus) {

                            cameraStatus.textContent =
                                "Получаем данные чека...";

                        }


                        await stopScanner();


                        await loadReceipt(
                            decodedText
                        );

                    },


                    () => {
                        // QR ещё не найден
                    }

                );


                console.log(
                    "СКАНЕР ЗАПУЩЕН"
                );

            }

            catch (error) {

                console.error(
                    "ОШИБКА СКАНЕРА:",
                    error
                );


                scanning =
                    false;

                scanner =
                    null;


                if (cameraStatus) {

                    cameraStatus.textContent =
                        "Не удалось запустить камеру";

                }

            }

        }
    );

}


// ==========================================
// STOP SCANNER
// ==========================================

async function stopScanner() {

    if (!scanner) {

        scanning =
            false;

        return;

    }


    try {

        if (scanning) {

            await scanner.stop();

        }

    }

    catch (error) {

        console.error(
            "Ошибка остановки:",
            error
        );

    }


    try {

        await scanner.clear();

    }

    catch (error) {

        console.error(
            "Ошибка очистки:",
            error
        );

    }


    scanner =
        null;

    scanning =
        false;

}


// ==========================================
// LOAD RECEIPT FROM SOLIQ
// ==========================================

async function loadReceipt(
    qrUrl
) {

    try {

        console.log(
            "QR:",
            qrUrl
        );


        if (cameraStatus) {

            cameraStatus.textContent =
                "Подключаемся к Soliq...";

        }


        const response =
            await fetch(
                "/api/check?url=" +
                encodeURIComponent(
                    qrUrl
                )
            );


        const data =
            await response.json();


        console.log(
            "Ответ сервера:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Не удалось получить чек"
            );

        }


        const receipt =
            data.receipt;


        if (!receipt) {

            throw new Error(
                "Сервер не вернул данные чека"
            );

        }


        const normalizedReceipt =
            normalizeReceipt(
                receipt
            );


        showReceiptResult(
            normalizedReceipt
        );


        await saveReceiptToDatabase(
            normalizedReceipt
        );


        if (cameraStatus) {

            cameraStatus.textContent =
                "Чек сохранён!";

        }

    }

    catch (error) {

        console.error(
            "ОШИБКА ПОЛУЧЕНИЯ ЧЕКА:",
            error
        );


        if (cameraStatus) {

            cameraStatus.textContent =
                "Не удалось получить чек";

        }


        if (qrResult) {

            qrResult.innerHTML =
                "<strong>Ошибка</strong><br><br>" +
                escapeHtml(
                    error.message
                );

        }

    }

}


// ==========================================
// PARSE MONEY
// ==========================================

function parseMoney(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    if (typeof value === "number") {

        return Number.isFinite(value)
            ? value
            : 0;

    }


    let text =
        String(value)
            .trim();


    if (!text) {
        return 0;
    }


    text =
        text
            .replace(/\s/g, "")
            .replace(/[^\d.,-]/g, "");


    if (!text) {
        return 0;
    }


    if (
        text.includes(",") &&
        text.includes(".")
    ) {

        const lastComma =
            text.lastIndexOf(",");

        const lastDot =
            text.lastIndexOf(".");


        if (lastComma > lastDot) {

            text =
                text
                    .replace(/\./g, "")
                    .replace(",", ".");

        }

        else {

            text =
                text.replace(/,/g, "");

        }

    }

    else if (text.includes(",")) {

        const parts =
            text.split(",");


        if (
            parts.length === 2 &&
            parts[1].length <= 2
        ) {

            text =
                text.replace(",", ".");

        }

        else {

            text =
                text.replace(/,/g, "");

        }

    }

    else if (text.includes(".")) {

        const parts =
            text.split(".");


        if (
            parts.length === 2 &&
            parts[1].length === 3
        ) {

            text =
                text.replace(/\./g, "");

        }

    }


    const result =
        parseFloat(text);


    return Number.isFinite(result)
        ? result
        : 0;

}


// ==========================================
// GET PRODUCT PRICE
// ==========================================

function getProductPrice(product) {

    if (!product) {
        return 0;
    }


    const possiblePrices = [

        product.price,

        product.sum,

        product.amountPrice,

        product.total,

        product.totalPrice,

        product.cost,

        product.priceTotal

    ];


    for (
        const value of possiblePrices
    ) {

        const parsed =
            parseMoney(value);


        if (parsed > 0) {

            return parsed;

        }

    }


    return 0;

}


// ==========================================
// GET PRODUCT QUANTITY
// ==========================================

function getProductQuantity(product) {

    if (!product) {
        return 1;
    }


    const possibleQuantity = [

        product.amount,

        product.quantity,

        product.count,

        product.qty

    ];


    for (
        const value of possibleQuantity
    ) {

        const parsed =
            parseMoney(value);


        if (parsed > 0) {

            return parsed;

        }

    }


    return 1;

}


// ==========================================
// PRODUCT ICONS
// ==========================================

function getProductIcon(
    name,
    category
) {

    const text =
        String(
            `${name || ""} ${category || ""}`
        ).toLowerCase();


    // ======================================
    // МОЛОЧНЫЕ ПРОДУКТЫ
    // ======================================

    if (
        text.includes("молоко") ||
        text.includes("milk") ||
        text.includes("sut") ||
        text.includes("qatiq") ||
        text.includes("кефир") ||
        text.includes("йогурт") ||
        text.includes("творог") ||
        text.includes("сыр") ||
        text.includes("pishloq") ||
        text.includes("dairy") ||
        text.includes("молоч")
    ) {

        return "🥛";

    }


    // ======================================
    // ЯЙЦА
    // ======================================

    if (
        text.includes("яйц") ||
        text.includes("egg") ||
        text.includes("tuxum") ||
        text.includes("eggs")
    ) {

        return "🥚";

    }


    // ======================================
    // ХЛЕБ И ВЫПЕЧКА
    // ======================================

    if (
        text.includes("хлеб") ||
        text.includes("bread") ||
        text.includes("non") ||
        text.includes("батон") ||
        text.includes("булка") ||
        text.includes("лаваш") ||
        text.includes("baking") ||
        text.includes("bakery") ||
        text.includes("выпеч") ||
        text.includes("пирог")
    ) {

        return "🍞";

    }


    // ======================================
    // СЛИВОЧНОЕ МАСЛО
    // ======================================

    if (
        text.includes("сливочн") ||
        text.includes("butter") ||
        text.includes("масло сливочное") ||
        text.includes("margarin") ||
        text.includes("margarine")
    ) {

        return "🧈";

    }


    // ======================================
    // РАСТИТЕЛЬНОЕ МАСЛО
    // ======================================

    if (
        text.includes("подсолнеч") ||
        text.includes("растительн") ||
        text.includes("оливков") ||
        text.includes("olive oil") ||
        text.includes("sunflower oil") ||
        text.includes("vegetable oil") ||
        text.includes("кунжутн") ||
        text.includes("кукурузн") ||
        text.includes("moy")
    ) {

        return '<img src="oil.png" class="product-icon-img">';

    }


    // ======================================
    // РИС И КРУПЫ
    // ======================================

    if (
        text.includes("рис") ||
        text.includes("rice") ||
        text.includes("guruch") ||
        text.includes("греч") ||
        text.includes("гречка") ||
        text.includes("buckwheat") ||
        text.includes("овсян") ||
        text.includes("oat") ||
        text.includes("макарон") ||
        text.includes("pasta") ||
        text.includes("вермиш") ||
        text.includes("круп") ||
        text.includes("cereal")
    ) {

        return "🍚";

    }


    // ======================================
    // САХАР И СОЛЬ
    // ======================================

    if (
        text.includes("сахар") ||
        text.includes("sugar") ||
        text.includes("shakar") ||
        text.includes("соль") ||
        text.includes("salt") ||
        text.includes("tuz")
    ) {

        return "🧂";

    }


    // ======================================
    // ФРУКТЫ
    // ======================================

    if (
        text.includes("яблок") ||
        text.includes("apple") ||
        text.includes("olma") ||
        text.includes("банан") ||
        text.includes("banana") ||
        text.includes("banan") ||
        text.includes("апельсин") ||
        text.includes("orange") ||
        text.includes("uzum") ||
        text.includes("виноград") ||
        text.includes("fruit") ||
        text.includes("фрукт") ||
        text.includes("груш") ||
        text.includes("pear") ||
        text.includes("персик") ||
        text.includes("peach") ||
        text.includes("лимон") ||
        text.includes("lemon")
    ) {

        return "🍎";

    }


    // ======================================
    // ОВОЩИ
    // ======================================

    if (
        text.includes("картоф") ||
        text.includes("potato") ||
        text.includes("kartosh") ||
        text.includes("помидор") ||
        text.includes("томат") ||
        text.includes("tomato") ||
        text.includes("огур") ||
        text.includes("cucumber") ||
        text.includes("sabzi") ||
        text.includes("морков") ||
        text.includes("капуст") ||
        text.includes("cabbage") ||
        text.includes("лук") ||
        text.includes("onion") ||
        text.includes("vegetable") ||
        text.includes("овощ")
    ) {

        return "🥕";

    }


    // ======================================
    // МЯСО
    // ======================================

    if (
        text.includes("мясо") ||
        text.includes("говядин") ||
        text.includes("свинин") ||
        text.includes("куриц") ||
        text.includes("курин") ||
        text.includes("мяс") ||
        text.includes("meat") ||
        text.includes("chicken") ||
        text.includes("tovuq") ||
        text.includes("beef") ||
        text.includes("pork") ||
        text.includes("баранин") ||
        text.includes("lamb")
    ) {

        return "🍗";

    }


    // ======================================
    // РЫБА И МОРЕПРОДУКТЫ
    // ======================================

    if (
        text.includes("рыб") ||
        text.includes("fish") ||
        text.includes("baliq") ||
        text.includes("лосось") ||
        text.includes("тунец") ||
        text.includes("salmon") ||
        text.includes("tuna") ||
        text.includes("seafood") ||
        text.includes("кревет") ||
        text.includes("shrimp")
    ) {

        return "🐟";

    }


    // ======================================
    // ВОДА
    // ======================================

    if (
        text.includes("вода") ||
        text.includes("water") ||
        text.includes("suv") ||
        text.includes("минераль") ||
        text.includes("mineral")
    ) {

        return "💧";

    }


    // ======================================
    // СОКИ
    // ======================================

    if (
        text.includes("сок") ||
        text.includes("juice") ||
        text.includes("sharbat") ||
        text.includes("nectar") ||
        text.includes("нектар")
    ) {

        return "🧃";

    }


    // ======================================
    // ГАЗИРОВКА
    // ======================================

    if (
        text.includes("cola") ||
        text.includes("кола") ||
        text.includes("спрайт") ||
        text.includes("sprite") ||
        text.includes("fanta") ||
        text.includes("фанта") ||
        text.includes("газиров") ||
        text.includes("газ") ||
        text.includes("soda")
    ) {

        return "🥤";

    }


    // ======================================
    // НАПИТКИ
    // ======================================

    if (
        text.includes("напит") ||
        text.includes("drink") ||
        text.includes("beverage")
    ) {

        return "🥤";

    }


    // ======================================
    // КОФЕ
    // ======================================

    if (
        text.includes("кофе") ||
        text.includes("coffee") ||
        text.includes("cafe") ||
        text.includes("кава") ||
        text.includes("qahva")
    ) {

        return "☕";

    }


    // ======================================
    // ЧАЙ
    // ======================================

    if (
        text.includes("чай") ||
        text.includes("tea") ||
        text.includes("choy")
    ) {

        return "🍵";

    }


    // ======================================
    // СЛАДОСТИ
    // ======================================

    if (
        text.includes("шоколад") ||
        text.includes("chocolate") ||
        text.includes("конфет") ||
        text.includes("печень") ||
        text.includes("cookie") ||
        text.includes("торт") ||
        text.includes("cake") ||
        text.includes("candy") ||
        text.includes("sweet") ||
        text.includes("слад") ||
        text.includes("морожен") ||
        text.includes("ice cream")
    ) {

        return "🍫";

    }


    // ======================================
    // ЧИПСЫ И СНЕКИ
    // ======================================

    if (
        text.includes("чипс") ||
        text.includes("chips") ||
        text.includes("snack") ||
        text.includes("сухар") ||
        text.includes("попкорн") ||
        text.includes("popcorn") ||
        text.includes("ореш") ||
        text.includes("nuts")
    ) {

        return "🍿";

    }


    // ======================================
    // КОСМЕТИКА
    // ======================================

    if (
        text.includes("шампун") ||
        text.includes("shampoo") ||
        text.includes("крем") ||
        text.includes("cream") ||
        text.includes("мыло") ||
        text.includes("soap") ||
        text.includes("зубн") ||
        text.includes("tooth") ||
        text.includes("cosmetic") ||
        text.includes("космет") ||
        text.includes("парфюм") ||
        text.includes("perfume")
    ) {

        return "🧴";

    }


    // ======================================
    // БЫТОВАЯ ХИМИЯ
    // ======================================

    if (
        text.includes("порош") ||
        text.includes("стирал") ||
        text.includes("моющ") ||
        text.includes("detergent") ||
        text.includes("washing") ||
        text.includes("хими") ||
        text.includes("household") ||
        text.includes("отбелив")
    ) {

        return "🧹";

    }


    // ======================================
    // БУМАЖНЫЕ ТОВАРЫ
    // ======================================

    if (
        text.includes("туалетн") ||
        text.includes("toilet paper") ||
        text.includes("салфет") ||
        text.includes("napkin") ||
        text.includes("tissue") ||
        text.includes("бумаж") ||
        text.includes("paper towel") ||
        text.includes("полотенц")
    ) {

        return "🧻";

    }


    // ======================================
    // ЭЛЕКТРОНИКА
    // ======================================

    if (
        text.includes("телефон") ||
        text.includes("phone") ||
        text.includes("iphone") ||
        text.includes("samsung") ||
        text.includes("наушник") ||
        text.includes("headphone") ||
        text.includes("заряд") ||
        text.includes("charger") ||
        text.includes("электрон") ||
        text.includes("electronics") ||
        text.includes("laptop") ||
        text.includes("ноутбук") ||
        text.includes("computer") ||
        text.includes("компьютер") ||
        text.includes("tablet") ||
        text.includes("планшет") ||
        text.includes("ipad") ||
        text.includes("watch") ||
        text.includes("часы")
    ) {

        return "📱";

    }


    // ======================================
    // КОМПЛЕКТУЮЩИЕ ПК
    // ======================================

    if (
        text.includes("видеокарт") ||
        text.includes("gpu") ||
        text.includes("graphics card") ||
        text.includes("процессор") ||
        text.includes("cpu") ||
        text.includes("processor") ||
        text.includes("оператив") ||
        text.includes("ram") ||
        text.includes("ssd") ||
        text.includes("hdd") ||
        text.includes("материнск") ||
        text.includes("motherboard") ||
        text.includes("блок питания") ||
        text.includes("power supply") ||
        text.includes("корпус") ||
        text.includes("computer parts") ||
        text.includes("pc parts")
    ) {

        return "🖥️";

    }


    // ======================================
    // ОДЕЖДА
    // ======================================

    if (
        text.includes("футбол") ||
        text.includes("рубаш") ||
        text.includes("джинс") ||
        text.includes("куртк") ||
        text.includes("одежд") ||
        text.includes("shirt") ||
        text.includes("clothes") ||
        text.includes("clothing") ||
        text.includes("dress") ||
        text.includes("плать") ||
        text.includes("брюк") ||
        text.includes("штаны") ||
        text.includes("pants")
    ) {

        return "👕";

    }


    // ======================================
    // ОБУВЬ
    // ======================================

    if (
        text.includes("обув") ||
        text.includes("shoes") ||
        text.includes("shoe") ||
        text.includes("кроссов") ||
        text.includes("sneaker") ||
        text.includes("ботин") ||
        text.includes("сапог") ||
        text.includes("boots")
    ) {

        return "👟";

    }


    // ======================================
    // СУМКИ И РЮКЗАКИ
    // ======================================

    if (
        text.includes("сумк") ||
        text.includes("bag") ||
        text.includes("backpack") ||
        text.includes("рюкзак") ||
        text.includes("портфел") ||
        text.includes("чемодан")
    ) {

        return "🎒";

    }


    // ======================================
    // КАНЦТОВАРЫ
    // ======================================

    if (
        text.includes("ручка") ||
        text.includes("pen") ||
        text.includes("карандаш") ||
        text.includes("pencil") ||
        text.includes("тетрад") ||
        text.includes("notebook") ||
        text.includes("бумага") ||
        text.includes("paper") ||
        text.includes("канц") ||
        text.includes("marker") ||
        text.includes("маркер") ||
        text.includes("линей") ||
        text.includes("ruler")
    ) {

        return "✏️";

    }


    // ======================================
    // АПТЕКА
    // ======================================

    if (
        text.includes("лекар") ||
        text.includes("таблет") ||
        text.includes("medicine") ||
        text.includes("pharmacy") ||
        text.includes("аптек") ||
        text.includes("витамин") ||
        text.includes("vitamin")
    ) {

        return "💊";

    }


    // ======================================
    // ИГРУШКИ
    // ======================================

    if (
        text.includes("игруш") ||
        text.includes("toy") ||
        text.includes("toys") ||
        text.includes("детск") ||
        text.includes("lego") ||
        text.includes("кукл") ||
        text.includes("doll")
    ) {

        return "🧸";

    }


    // ======================================
    // АВТОТОВАРЫ
    // ======================================

    if (
        text.includes("авто") ||
        text.includes("car") ||
        text.includes("машин") ||
        text.includes("шина") ||
        text.includes("tire") ||
        text.includes("oil filter") ||
        text.includes("автозапчаст") ||
        text.includes("запчаст") ||
        text.includes("car parts")
    ) {

        return "🚗";

    }


    // ======================================
    // ИНСТРУМЕНТЫ
    // ======================================

    if (
        text.includes("инструмент") ||
        text.includes("tool") ||
        text.includes("дрель") ||
        text.includes("drill") ||
        text.includes("молоток") ||
        text.includes("hammer") ||
        text.includes("отвёртк") ||
        text.includes("отвертк") ||
        text.includes("screwdriver") ||
        text.includes("пила") ||
        text.includes("saw") ||
        text.includes("ключ") ||
        text.includes("wrench")
    ) {

        return "🔧";

    }


    // ======================================
    // ТОВАРЫ ДЛЯ ДОМА
    // ======================================

    if (
        text.includes("дом") ||
        text.includes("home") ||
        text.includes("house") ||
        text.includes("посуда") ||
        text.includes("dish") ||
        text.includes("тарел") ||
        text.includes("чаш") ||
        text.includes("сковород") ||
        text.includes("кастрюл") ||
        text.includes("мебел") ||
        text.includes("furniture")
    ) {

        return "🏠";

    }


    // ======================================
    // СПОРТ
    // ======================================

    if (
        text.includes("спорт") ||
        text.includes("sport") ||
        text.includes("football") ||
        text.includes("футбол") ||
        text.includes("баскетбол") ||
        text.includes("basketball") ||
        text.includes("тренаж") ||
        text.includes("gym") ||
        text.includes("фитнес") ||
        text.includes("fitness")
    ) {

        return "⚽";

    }


    // ======================================
    // ТОВАРЫ ДЛЯ ЖИВОТНЫХ
    // ======================================

    if (
        text.includes("корм") ||
        text.includes("pet") ||
        text.includes("animal") ||
        text.includes("кошк") ||
        text.includes("cat") ||
        text.includes("собак") ||
        text.includes("dog") ||
        text.includes("щен") ||
        text.includes("котён") ||
        text.includes("котен")
    ) {

        return "🐾";

    }


    // ======================================
    // ЦВЕТЫ И РАСТЕНИЯ
    // ======================================

    if (
        text.includes("цвет") ||
        text.includes("flower") ||
        text.includes("растен") ||
        text.includes("plant") ||
        text.includes("букет") ||
        text.includes("garden") ||
        text.includes("сад")
    ) {

        return "🌸";

    }


    // ======================================
    // ДЕТСКИЕ ТОВАРЫ
    // ======================================

    if (
        text.includes("детск") ||
        text.includes("baby") ||
        text.includes("ребён") ||
        text.includes("ребен") ||
        text.includes("малыш") ||
        text.includes("подгуз") ||
        text.includes("diaper") ||
        text.includes("детское питание")
    ) {

        return "👶";

    }


    // ======================================
    // УКРАШЕНИЯ
    // ======================================

    if (
        text.includes("ювелир") ||
        text.includes("jewelry") ||
        text.includes("jewellery") ||
        text.includes("кольц") ||
        text.includes("ring") ||
        text.includes("цепоч") ||
        text.includes("necklace") ||
        text.includes("браслет") ||
        text.includes("bracelet") ||
        text.includes("серьг") ||
        text.includes("earring")
    ) {

        return "💍";

    }


    // ======================================
    // КНИГИ
    // ======================================

    if (
        text.includes("книг") ||
        text.includes("book") ||
        text.includes("books") ||
        text.includes("учебник") ||
        text.includes("textbook") ||
        text.includes("роман")
    ) {

        return "📚";

    }


    // ======================================
    // ПОДАРКИ
    // ======================================

    if (
        text.includes("подар") ||
        text.includes("gift") ||
        text.includes("present") ||
        text.includes("сувенир") ||
        text.includes("souvenir")
    ) {

        return "🎁";

    }


    // ======================================
    // БАГАЖ
    // ======================================

    if (
        text.includes("багаж") ||
        text.includes("luggage") ||
        text.includes("suitcase") ||
        text.includes("чемодан") ||
        text.includes("travel") ||
        text.includes("путешеств")
    ) {

        return "🧳";

    }


    // ======================================
    // ЕСЛИ НЕ НАШЛИ
    // ======================================

    return "🛍️";

}


// ==========================================
// CALCULATE PRODUCTS TOTAL
// ==========================================

function calculateProductsTotal(
    products
) {

    if (
        !Array.isArray(products) ||
        !products.length
    ) {

        return 0;

    }


    let total = 0;


    products.forEach(
        product => {

            const price =
                getProductPrice(
                    product
                );


            const quantity =
                getProductQuantity(
                    product
                );


            total +=
                price *
                quantity;

        }
    );


    return total;

}


// ==========================================
// GET RECEIPT TOTAL
// ==========================================

function getReceiptTotal(
    receipt
) {

    if (!receipt) {
        return 0;
    }


    const products =
        Array.isArray(
            receipt.products
        )
            ? receipt.products
            : Array.isArray(
                receipt.paymentDetails
            )
                ? receipt.paymentDetails
                : [];


    const possibleTotals = [

        receipt.total,

        receipt.cashTotal,

        receipt.totalSum,

        receipt.grandTotal,

        receipt.amount,

        receipt.sum

    ];


    for (
        const value of possibleTotals
    ) {

        const parsed =
            parseMoney(value);


        if (parsed > 0) {

            return parsed;

        }

    }


    const productsTotal =
        calculateProductsTotal(
            products
        );


    return productsTotal;

}


// ==========================================
// SHOW RECEIPT RESULT
// ==========================================

function showReceiptResult(
    receipt
) {

    const company =
        receipt.store ||
        receipt.extraInfo?.companyName ||
        "Магазин не указан";


    const total =
        getReceiptTotal(
            receipt
        );


    const date =
        receipt.date ||
        receipt.paymentDate ||
        "Дата не указана";


    const products =
        Array.isArray(
            receipt.products
        )
            ? receipt.products
            : Array.isArray(
                receipt.paymentDetails
            )
                ? receipt.paymentDetails
                : [];


    let html =
        "<strong>Чек получен!</strong><br><br>";


    html +=
        "<b>Магазин:</b> " +
        escapeHtml(company) +
        "<br>";


    html +=
        "<b>Сумма:</b> " +
        formatMoney(total) +
        " сум<br>";


    html +=
        "<b>Дата:</b> " +
        escapeHtml(date) +
        "<br>";


    html +=
        "<b>Товаров:</b> " +
        products.length +
        "<br><br>";


    html +=
        "<strong>Товары:</strong><br>";


    products.forEach(
        product => {

            const name =
                product.name ||
                "Без названия";


            const price =
                getProductPrice(
                    product
                );


            const amount =
                getProductQuantity(
                    product
                );


            html +=
                "• " +
                escapeHtml(name) +
                " — " +
                formatMoney(price) +
                " сум × " +
                escapeHtml(amount) +
                "<br>";

        }
    );


    if (qrResult) {

        qrResult.innerHTML =
            html;

    }

}


// ==========================================
// NORMALIZE RECEIPT
// ==========================================

function normalizeReceipt(
    receipt
) {

    const products =
        Array.isArray(
            receipt.products
        )
            ? receipt.products
            : Array.isArray(
                receipt.paymentDetails
            )
                ? receipt.paymentDetails
                : [];


    const store =
        receipt.store ||
        receipt.extraInfo?.companyName ||
        "Магазин";


    const total =
        getReceiptTotal(
            receipt
        );


    const date =
        receipt.date ||
        receipt.paymentDate ||
        "Дата неизвестна";


    const items =
        receipt.items ??
        products.length;


    return {
        ...receipt,

        store,

        total,

        date,

        items,

        products

    };

}


// ==========================================
// SAVE RECEIPT
// ==========================================

async function saveReceiptToDatabase(
    receipt
) {

    const credential =
        getGoogleCredential();


    if (!credential) {

        console.error(
            "Credential отсутствует"
        );

        return;

    }


    const response =
        await fetch(
            "/api/receipts",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        credential:
                            credential,

                        receipt:
                            receipt

                    })

            }
        );


    const data =
        await response.json();


    console.log(
        "Ответ сохранения:",
        data
    );


    if (
        !response.ok ||
        !data.success
    ) {

        throw new Error(
            data.error ||
            "Не удалось сохранить чек"
        );

    }


    await loadSavedReceipts();

}


// ==========================================
// GET CURRENT LANGUAGE
// ==========================================

function getCurrentLanguage() {

    return (
        localStorage.getItem(
            "myReceiptsLanguage"
        ) || "ru"
    );

}


// ==========================================
// GET RECEIPT DATE
// ==========================================

function getReceiptDate(
    receipt
) {

    const rawDate =
        receipt.date ||
        receipt.paymentDate ||
        receipt.createdAt ||
        receipt.created_at;


    if (!rawDate) {
        return null;
    }


    const date =
        new Date(
            rawDate
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


// ==========================================
// GET RECEIPT DATE GROUP
// ==========================================

function getReceiptDateGroup(
    receipt
) {

    const date =
        getReceiptDate(
            receipt
        );


    if (!date) {

        return "unknown";

    }


    const today =
        new Date();


    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate() - 1
    );


    const dateDay =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );


    const todayDay =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    const yesterdayDay =
        new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate()
        );


    if (
        dateDay.getTime() ===
        todayDay.getTime()
    ) {

        return "today";

    }


    if (
        dateDay.getTime() ===
        yesterdayDay.getTime()
    ) {

        return "yesterday";

    }


    return formatReceiptDateGroup(
        date
    );

}


// ==========================================
// FORMAT RECEIPT DATE GROUP
// ==========================================

function formatReceiptDateGroup(
    date
) {

    const language =
        getCurrentLanguage();


    let locale =
        "ru-RU";


    if (language === "uz") {

        locale =
            "uz-UZ";

    }


    else if (language === "en") {

        locale =
            "en-US";

    }


    return date.toLocaleDateString(
        locale,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ==========================================
// CREATE DATE GROUP
// ==========================================

function createReceiptDateGroup(
    groupKey
) {

    if (!receiptList) {
        return null;
    }


    const group =
        document.createElement(
            "div"
        );


    group.className =
        "receipt-date-group";


    const language =
        getCurrentLanguage();


    let title;


    if (
        groupKey === "today"
    ) {

        title =
            translations[language]?.today ||
            "Сегодня";

    }


    else if (
        groupKey === "yesterday"
    ) {

        title =
            translations[language]?.yesterday ||
            "Вчера";

    }


    else {

        title =
            groupKey;

    }


    group.textContent =
        title;


    return group;

}


// ==========================================
// LOAD SAVED RECEIPTS
// ==========================================

async function loadSavedReceipts() {

    const credential =
        getGoogleCredential();


    if (!credential) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/receipts/list",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            credential:
                                credential

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "Чеки:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Не удалось загрузить чеки"
            );

        }


        // Удаляем старые карточки
        // и старые заголовки дат

        removeDynamicReceipts();


        const receipts =
            Array.isArray(
                data.receipts
            )
                ? data.receipts
                : [];


        const normalizedReceipts =
            receipts.map(
                receipt =>
                    normalizeReceipt(
                        receipt
                    )
            );


        // ======================================
        // СОРТИРОВКА
        // Новые чеки сверху
        // ======================================

        normalizedReceipts.sort(
            (a, b) => {

                const dateA =
                    getReceiptDate(a);

                const dateB =
                    getReceiptDate(b);


                if (
                    !dateA &&
                    !dateB
                ) {

                    return 0;

                }


                if (!dateA) {

                    return 1;

                }


                if (!dateB) {

                    return -1;

                }


                return (
                    dateB.getTime() -
                    dateA.getTime()
                );

            }
        );


        // ======================================
        // ГРУППИРОВКА
        // ======================================

        let currentGroup =
            null;


        normalizedReceipts.forEach(
            receipt => {

                const groupKey =
                    getReceiptDateGroup(
                        receipt
                    );


                if (
                    groupKey !==
                    currentGroup
                ) {

                    currentGroup =
                        groupKey;


                    const dateGroup =
                        createReceiptDateGroup(
                            groupKey
                        );


                    if (dateGroup) {

                        receiptList.appendChild(
                            dateGroup
                        );

                    }

                }


                createReceiptCard(
                    receipt,
                    false
                );

            }
        );


        updateStatistics(
            normalizedReceipts
        );


        console.log(
            `Загружено чеков: ${normalizedReceipts.length}`
        );

    }

    catch (error) {

        console.error(
            "ОШИБКА ЗАГРУЗКИ ЧЕКОВ:",
            error
        );

    }

}


// ==========================================
// REMOVE RECEIPTS
// ==========================================

function removeDynamicReceipts() {

    if (!receiptList) {
        return;
    }


    receiptList
        .querySelectorAll(
            ".database-receipt, .receipt-date-group"
        )
        .forEach(
            element => {

                element.remove();

            }
        );

}


// ==========================================
// CREATE RECEIPT CARD
// ==========================================

function createReceiptCard(
    receipt,
    prepend = true
) {

    if (!receiptList) {
        return;
    }


    const receiptElement =
        document.createElement(
            "div"
        );


    receiptElement.className =
        "receipt database-receipt";


    const products =
        Array.isArray(
            receipt.products
        )
            ? receipt.products
            : [];


    const total =
        getReceiptTotal(
            receipt
        );


    const itemsCount =
        receipt.items ??
        products.length;


    const warranty =
        receipt.warranty ||
        "—";


    receiptElement.innerHTML = `

        <div class="receipt-img">
            🧾
        </div>

        <div class="receipt-info">

            <b>
                ${escapeHtml(
                    receipt.store ||
                    "Магазин"
                )}
            </b>

            <span>
                ${escapeHtml(
                    receipt.date ||
                    "Дата неизвестна"
                )}
            </span>

        </div>

        <div class="price">

            <b>
                ${formatMoney(total)} сум
            </b>

            <span>
                ${itemsCount} товаров
            </span>

        </div>

        <div class="guarantee">

            Гарантия до<br>

            <b>
                ${escapeHtml(
                    warranty
                )}
            </b>

        </div>

        <div class="arrow">
            ›
        </div>

    `;


    receiptElement.addEventListener(
        "click",
        () => {

            currentReceiptElement =
                receiptElement;


            currentReceiptId =
                receipt.id;


            openReceiptPanel(
                receipt
            );

        }
    );


    if (prepend) {

        receiptList.prepend(
            receiptElement
        );

    }

    else {

        receiptList.appendChild(
            receiptElement
        );

    }

}


// ==========================================
// OPEN RECEIPT PANEL
// ==========================================

function openReceiptPanel(
    receipt
) {

    if (!receiptPanel) {
        return;
    }


    currentReceiptId =
        receipt.id;


    const total =
        getReceiptTotal(
            receipt
        );


    setText(
        "panelStoreName",
        receipt.store ||
        "Магазин"
    );


    setText(
        "panelDate",
        receipt.date ||
        "Дата неизвестна"
    );


    setText(
        "panelTotal",
        formatMoney(
            total
        ) +
        " сум"
    );


    const products =
        Array.isArray(
            receipt.products
        )
            ? receipt.products
            : [];


    const itemsCount =
        receipt.items ??
        products.length;


    setText(
        "panelItems",
        itemsCount
    );


    setText(
        "panelCategory",
        receipt.category ||
        "—"
    );


    setText(
        "panelWarranty",
        receipt.warranty ||
        "—"
    );


    setText(
        "panelShop",
        receipt.store ||
        "—"
    );


    const productsContainer =
        document.getElementById(
            "panelProducts"
        );


    if (productsContainer) {

        productsContainer.innerHTML =
            "";


        if (!products.length) {

            productsContainer.innerHTML =
                "<span>Товары не указаны</span>";

        }


        products.forEach(
            product => {

                const productElement =
                    document.createElement(
                        "div"
                    );


                productElement.className =
                    "panel-product";


                const name =
                    product.name ||
                    "Без названия";


                const quantity =
                    getProductQuantity(
                        product
                    );


                const price =
                    getProductPrice(
                        product
                    );


                const productIcon =
                    getProductIcon(
                        name,
                        product.category
                    );


                productElement.innerHTML = `

                    <div class="panel-product-icon">
                        ${productIcon}
                    </div>

                    <div class="panel-product-info">

                        <b>
                            ${escapeHtml(name)}
                        </b>

                        <span>
                            ${escapeHtml(quantity)} шт.
                        </span>

                    </div>

                    <div class="panel-product-price">
                        ${formatMoney(price)} сум
                    </div>

                `;


                productsContainer.appendChild(
                    productElement
                );

            }
        );

    }


    receiptPanel.classList.add(
        "open"
    );

}


// ==========================================
// CLOSE RECEIPT PANEL
// ==========================================

function closeReceiptDetails() {

    if (!receiptPanel) {
        return;
    }


    receiptPanel.classList.remove(
        "open"
    );


    currentReceiptId =
        null;


    currentReceiptElement =
        null;

}


// ==========================================
// CLOSE RECEIPT PANEL WITH X
// ==========================================

if (closeReceiptPanel) {

    closeReceiptPanel.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            closeReceiptDetails();

        }
    );

}


// ==========================================
// DELETE CONFIRMATION
// ==========================================

function openDeleteConfirmation() {

    if (!currentReceiptId) {
        return;
    }


    if (!deleteConfirmOverlay) {

        console.error(
            "deleteConfirmOverlay не найден"
        );

        return;

    }


    deleteConfirmOverlay.classList.add(
        "active"
    );

}


function closeDeleteConfirmation() {

    if (!deleteConfirmOverlay) {
        return;
    }


    deleteConfirmOverlay.classList.remove(
        "active"
    );

}


// ==========================================
// DELETE BUTTON
// ==========================================

if (deleteReceiptBtn) {

    deleteReceiptBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!currentReceiptId) {

                console.error(
                    "Чек не выбран"
                );

                return;

            }


            openDeleteConfirmation();

        }
    );

}


// ==========================================
// CANCEL DELETE
// ==========================================

if (deleteCancelBtn) {

    deleteCancelBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            closeDeleteConfirmation();

        }
    );

}


// ==========================================
// DELETE MODAL BACKGROUND
// ==========================================

if (deleteConfirmOverlay) {

    deleteConfirmOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                deleteConfirmOverlay
            ) {

                closeDeleteConfirmation();

            }

        }
    );

}


// ==========================================
// CONFIRM DELETE
// ==========================================

if (deleteConfirmBtn) {

    deleteConfirmBtn.addEventListener(
        "click",
        async event => {

            event.preventDefault();

            event.stopPropagation();


            if (!currentReceiptId) {
                return;
            }


            const credential =
                getGoogleCredential();


            if (!credential) {

                closeDeleteConfirmation();

                alert(
                    "Нужно войти через Google"
                );

                return;

            }


            const receiptId =
                currentReceiptId;


            try {

                deleteConfirmBtn.disabled =
                    true;


                deleteConfirmBtn.textContent =
                    "Удаление...";


                const response =
                    await fetch(
                        "/api/receipts/" +
                        encodeURIComponent(
                            receiptId
                        ),
                        {

                            method:
                                "DELETE",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    credential

                            }

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Ответ удаления:",
                    data
                );


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.error ||
                        "Не удалось удалить чек"
                    );

                }


                if (currentReceiptElement) {

                    currentReceiptElement.remove();

                }


                closeDeleteConfirmation();

                closeReceiptDetails();

                await loadSavedReceipts();


                console.log(
                    "Чек удалён:",
                    receiptId
                );

            }

            catch (error) {

                console.error(
                    "Ошибка удаления:",
                    error
                );


                alert(
                    "Не удалось удалить чек:\n" +
                    error.message
                );

            }

            finally {

                deleteConfirmBtn.disabled =
                    false;


                const language =
                    localStorage.getItem(
                        "myReceiptsLanguage"
                    ) || "ru";


                if (
                    translations[language]
                ) {

                    deleteConfirmBtn.textContent =
                        translations[
                            language
                        ].confirmDelete;

                }

                else {

                    deleteConfirmBtn.textContent =
                        "Удалить";

                }

            }

        }
    );

}


// ==========================================
// CLOSE CAMERA
// ==========================================

async function closeCameraWindow() {

    await stopScanner();


    if (cameraModal) {

        cameraModal.classList.remove(
            "show"
        );

    }


    if (qrResult) {

        qrResult.innerHTML =
            "";

    }


    if (cameraStatus) {

        cameraStatus.textContent =
            "Нажмите «Сканировать чек»";

    }


    qrAlreadyFound =
        false;

}


if (closeCamera) {

    closeCamera.addEventListener(
        "click",
        closeCameraWindow
    );

}


if (cancelCamera) {

    cancelCamera.addEventListener(
        "click",
        closeCameraWindow
    );

}


// ==========================================
// ESC
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        if (
            deleteConfirmOverlay &&
            deleteConfirmOverlay.classList.contains(
                "active"
            )
        ) {

            closeDeleteConfirmation();

            return;

        }


        if (
            accountProfileOverlay &&
            accountProfileOverlay.classList.contains(
                "active"
            )
        ) {

            accountProfileOverlay.classList.remove(
                "active"
            );

            return;

        }


        if (
            accountSettingsOverlay &&
            accountSettingsOverlay.classList.contains(
                "active"
            )
        ) {

            accountSettingsOverlay.classList.remove(
                "active"
            );

            return;

        }


        closeCameraWindow();

        closeReceiptDetails();


        if (languageDropdown) {

            languageDropdown.classList.remove(
                "open"
            );

        }

    }
);


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics(
    receipts
) {

    const totalReceipts =
        document.getElementById(
            "totalReceipts"
        );


    const totalSpent =
        document.getElementById(
            "totalSpent"
        );


    const averageReceipt =
        document.getElementById(
            "averageReceipt"
        );


    const count =
        Array.isArray(receipts)
            ? receipts.length
            : 0;


    let spent =
        0;


    if (Array.isArray(receipts)) {

        receipts.forEach(
            receipt => {

                spent +=
                    getReceiptTotal(
                        receipt
                    );

            }
        );

    }


    const average =
        count > 0
            ? spent / count
            : 0;


    if (totalReceipts) {

        if (count === 0) {

            totalReceipts.textContent =
                "";

        }

        else {

            totalReceipts.textContent =
                count;

        }

    }


    if (totalSpent) {

        totalSpent.textContent =
            formatMoney(spent) +
            " сум";

    }


    if (averageReceipt) {

        averageReceipt.textContent =
            formatMoney(
                Math.round(
                    average
                )
            ) +
            " сум";

    }


    const activeWarranties =
        document.getElementById(
            "activeWarranties"
        );


    if (activeWarranties) {

        activeWarranties.textContent =
            receipts.filter(
                receipt =>
                    receipt.warranty &&
                    receipt.warranty !== "—"
            ).length;

    }


    const profileReceipts =
        document.getElementById(
            "profileReceipts"
        );


    if (profileReceipts) {

        profileReceipts.textContent =
            count;

    }

}


// ==========================================
// SET TEXT
// ==========================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(
    number
) {

    const value =
        parseMoney(
            number
        );


    return value.toLocaleString(
        "ru-RU"
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(
    text
) {

    return String(
        text ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// TRANSLATIONS
// ==========================================

const translations = {

    ru: {

        tagline:
            "всегда под рукой",

        addReceipt:
            "＋ Добавить чек",

        allReceipts:
            "▣ Все чеки",

        warranties:
            "▣ Гарантии",

        analytics:
            "▣ Аналитика",

        stores:
            "▣ Магазины",

        categories:
            "▣ Категории",

        trash:
            "▣ Корзина",

        settings:
            "Настройки",

        help:
            "Помощь",

        searchPlaceholder:
            "Поиск по чекам, товарам, магазинам...",

        moreThanReceipts:
            "Больше, чем просто чеки",

        promoText:
            "Сохраняйте гарантии, отслеживайте траты и получайте напоминания",

        learnMore:
            "Узнать больше →",

        myReceipts:
            "Мои чеки",

        thisMonth:
            "Этот месяц",

        lastMonth:
            "Прошлый месяц",

        thisYear:
            "Этот год",

        filters:
            "☷ Фильтры",

        totalReceipts:
            "Всего чеков",

        spent:
            "Потрачено",

        averageReceipt:
            "Средний чек",

        activeWarranties:
            "Гарантии активны",

        august2026:
            "Октябрь 2026",

        showMore:
            "Показать ещё ↓",

        accountSettings:
            "Настройки аккаунта",

        accountSettingsDescription:
            "Управление вашим аккаунтом MyReceipts",

        profile:
            "Профиль",

        profileDescription:
            "Информация о вашем аккаунте MyReceipts",

        accountActive:
            "● Аккаунт активен",

        accountInformation:
            "Информация аккаунта",

        username:
            "Имя пользователя",

        email:
            "Электронная почта",

        accountType:
            "Тип аккаунта",

        google:
            "Google",

        googleAccount:
            "Аккаунт Google",

        googleDescription:
            "Аккаунт используется для входа в MyReceipts",

        connected:
            "● Подключён",

        yourReceipts:
            "Ваши чеки",

        receiptsDescription:
            "Все ваши чеки сохраняются в аккаунте",

        language:
            "Язык",

        languageDescription:
            "Выберите язык интерфейса MyReceipts",

        logout:
            "Выйти из аккаунта",

        receiptInfo:
            "Информация о чеке",

        total:
            "Итого",

        purchased:
            "Что куплено",

        itemCount:
            "Количество товаров",

        category:
            "Категория",

        warranty:
            "Гарантия",

        store:
            "Магазин",

        deleteReceipt:
            "🗑 Удалить чек",

        addReceiptTitle:
            "Добавить чек",

        scanDescription:
            "Наведите камеру на QR-код чека",

        scanReceipt:
            "Сканировать чек",

        exit:
            "Выйти",

        deleteConfirmTitle:
            "Удалить чек?",

        deleteConfirmText:
            "Вы действительно хотите удалить этот чек?",

        cancel:
            "Отмена",

        confirmDelete:
            "Удалить",

        today:
            "Сегодня",

        yesterday:
            "Вчера"

    },


    uz: {

        tagline:
            "har doim yoningizda",

        addReceipt:
            "＋ Chek qo‘shish",

        allReceipts:
            "▣ Barcha cheklar",

        warranties:
            "▣ Kafolatlar",

        analytics:
            "▣ Tahlil",

        stores:
            "▣ Do‘konlar",

        categories:
            "▣ Kategoriyalar",

        trash:
            "▣ Savat",

        settings:
            "Sozlamalar",

        help:
            "Yordam",

        searchPlaceholder:
            "Cheklar, mahsulotlar, do‘konlardan qidiring...",

        moreThanReceipts:
            "Bu shunchaki cheklar emas",

        promoText:
            "Kafolatlarni saqlang, xarajatlarni kuzating va eslatmalar oling",

        learnMore:
            "Batafsil →",

        myReceipts:
            "Mening cheklarim",

        thisMonth:
            "Bu oy",

        lastMonth:
            "O‘tgan oy",

        thisYear:
            "Bu yil",

        filters:
            "☷ Filtrlar",

        totalReceipts:
            "Jami cheklar",

        spent:
            "Sarflangan",

        averageReceipt:
            "O‘rtacha chek",

        activeWarranties:
            "Faol kafolatlar",

        august2026:
            "Oktyabr 2026",

        showMore:
            "Yana ko‘rsatish ↓",

        accountSettings:
            "Hisob sozlamalari",

        accountSettingsDescription:
            "MyReceipts hisobingizni boshqarish",

        profile:
            "Profil",

        profileDescription:
            "MyReceipts hisobingiz haqidagi ma’lumotlar",

        accountActive:
            "● Hisob faol",

        accountInformation:
            "Hisob ma’lumotlari",

        username:
            "Foydalanuvchi nomi",

        email:
            "Elektron pochta",

        accountType:
            "Hisob turi",

        google:
            "Google",

        googleAccount:
            "Google hisobi",

        googleDescription:
            "Hisob MyReceipts tizimiga kirish uchun ishlatiladi",

        connected:
            "● Ulangan",

        yourReceipts:
            "Sizning cheklaringiz",

        receiptsDescription:
            "Barcha cheklaringiz hisobingizda saqlanadi",

        language:
            "Til",

        languageDescription:
            "MyReceipts interfeysi tilini tanlang",

        logout:
            "Hisobdan chiqish",

        receiptInfo:
            "Chek ma’lumotlari",

        total:
            "Jami",

        purchased:
            "Xarid qilingan",

        itemCount:
            "Mahsulotlar soni",

        category:
            "Kategoriya",

        warranty:
            "Kafolat",

        store:
            "Do‘kon",

        deleteReceipt:
            "🗑 Chekni o‘chirish",

        addReceiptTitle:
            "Chek qo‘shish",

        scanDescription:
            "Kamerani chekdagi QR-kodga qarating",

        scanReceipt:
            "Chekni skanerlash",

        exit:
            "Chiqish",

        deleteConfirmTitle:
            "Chekni o‘chirish?",

        deleteConfirmText:
            "Haqiqatan ham ushbu chekni o‘chirmoqchimisiz?",

        cancel:
            "Bekor qilish",

        confirmDelete:
            "O‘chirish",

        today:
            "Bugun",

        yesterday:
            "Kecha"

    },


    en: {

        tagline:
            "always at hand",

        addReceipt:
            "＋ Add receipt",

        allReceipts:
            "▣ All receipts",

        warranties:
            "▣ Warranties",

        analytics:
            "▣ Analytics",

        stores:
            "▣ Stores",

        categories:
            "▣ Categories",

        trash:
            "▣ Trash",

        settings:
            "Settings",

        help:
            "Help",

        searchPlaceholder:
            "Search receipts, products, stores...",

        moreThanReceipts:
            "More than just receipts",

        promoText:
            "Save warranties, track expenses and get reminders",

        learnMore:
            "Learn more →",

        myReceipts:
            "My receipts",

        thisMonth:
            "This month",

        lastMonth:
            "Last month",

        thisYear:
            "This year",

        filters:
            "☷ Filters",

        totalReceipts:
            "Total receipts",

        spent:
            "Spent",

        averageReceipt:
            "Average receipt",

        activeWarranties:
            "Active warranties",

        august2026:
            "October 2026",

        showMore:
            "Show more ↓",

        accountSettings:
            "Account settings",

        accountSettingsDescription:
            "Manage your MyReceipts account",

        profile:
            "Profile",

        profileDescription:
            "Information about your MyReceipts account",

        accountActive:
            "● Account active",

        accountInformation:
            "Account information",

        username:
            "Username",

        email:
            "Email",

        accountType:
            "Account type",

        google:
            "Google",

        googleAccount:
            "Google account",

        googleDescription:
            "This account is used to sign in to MyReceipts",

        connected:
            "● Connected",

        yourReceipts:
            "Your receipts",

        receiptsDescription:
            "All your receipts are saved to your account",

        language:
            "Language",

        languageDescription:
            "Choose the MyReceipts interface language",

        logout:
            "Sign out",

        receiptInfo:
            "Receipt information",

        total:
            "Total",

        purchased:
            "Purchased",

        itemCount:
            "Number of items",

        category:
            "Category",

        warranty:
            "Warranty",

        store:
            "Store",

        deleteReceipt:
            "🗑 Delete receipt",

        addReceiptTitle:
            "Add receipt",

        scanDescription:
            "Point the camera at the receipt QR code",

        scanReceipt:
            "Scan receipt",

        exit:
            "Exit",

        deleteConfirmTitle:
            "Delete receipt?",

        deleteConfirmText:
            "Are you sure you want to delete this receipt?",

        cancel:
            "Cancel",

        confirmDelete:
            "Delete",

        today:
            "Today",

        yesterday:
            "Yesterday"

    }

};


// ==========================================
// APPLY LANGUAGE
// ==========================================

function applyLanguage(
    language
) {

    if (
        !translations[language]
    ) {

        language =
            "ru";

    }


    const dictionary =
        translations[language];


    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            element => {

                const key =
                    element.dataset.i18n;


                if (
                    Object.prototype.hasOwnProperty.call(
                        dictionary,
                        key
                    )
                ) {

                    element.textContent =
                        dictionary[key];

                }

            }
        );


    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(
            element => {

                const key =
                    element.dataset
                        .i18nPlaceholder;


                if (
                    Object.prototype.hasOwnProperty.call(
                        dictionary,
                        key
                    )
                ) {

                    element.placeholder =
                        dictionary[key];

                }

            }
        );


    document.documentElement.lang =
        language;


    localStorage.setItem(
        "myReceiptsLanguage",
        language
    );


    if (languageSelect) {

        languageSelect.value =
            language;

    }


    updateCustomLanguageUI(
        language
    );


    console.log(
        "Язык:",
        language
    );

}


// ==========================================
// LOAD LANGUAGE
// ==========================================

function loadSavedLanguage() {

    let language =
        localStorage.getItem(
            "myReceiptsLanguage"
        ) || "ru";


    if (
        !translations[language]
    ) {

        language =
            "ru";

    }


    applyLanguage(
        language
    );

}


// ==========================================
// REAL LANGUAGE SELECT
// ==========================================

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        event => {

            const language =
                event.target.value;


            if (
                translations[language]
            ) {

                applyLanguage(
                    language
                );

            }

        }
    );

}


// ==========================================
// CUSTOM LANGUAGE DROPDOWN
// ==========================================

function updateCustomLanguageUI(
    language
) {

    if (!languageOptions.length) {
        return;
    }


    languageOptions.forEach(
        option => {

            const optionLanguage =
                option.dataset.language;


            if (
                optionLanguage ===
                language
            ) {

                option.classList.add(
                    "selected"
                );


                if (selectedFlag) {

                    selectedFlag.textContent =
                        option.dataset.flag ||
                        "";

                }


                if (selectedLanguage) {

                    selectedLanguage.textContent =
                        option.dataset.name ||
                        "";

                }

            }

            else {

                option.classList.remove(
                    "selected"
                );

            }

        }
    );

}


// ==========================================
// OPEN / CLOSE LANGUAGE
// ==========================================

if (
    languageSelected &&
    languageDropdown
) {

    languageSelected.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            languageDropdown.classList.toggle(
                "open"
            );

        }
    );

}


// ==========================================
// SELECT LANGUAGE
// ==========================================

if (languageOptions.length) {

    languageOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const language =
                        option.dataset.language;


                    if (
                        !translations[language]
                    ) {

                        return;

                    }


                    applyLanguage(
                        language
                    );


                    if (languageDropdown) {

                        languageDropdown.classList.remove(
                            "open"
                        );

                    }

                }
            );

        }
    );

}


// ==========================================
// CLOSE LANGUAGE
// ==========================================

document.addEventListener(
    "click",
    event => {

        if (
            languageDropdown &&
            !languageDropdown.contains(
                event.target
            )
        ) {

            languageDropdown.classList.remove(
                "open"
            );

        }

    }
);


// ==========================================
// FINISH
// ==========================================

console.log(
    "================================"
);

console.log(
    "MyReceipts script.js загружен"
);

console.log(
    "Авторизация готова"
);

console.log(
    "QR Scanner готов"
);

console.log(
    "SQLite подключение готово"
);

console.log(
    "Профиль аккаунта готов"
);

console.log(
    "RU / UZ / EN готовы"
);

console.log(
    "Удаление чеков готово"
);

console.log(
    "Расчёт суммы чеков готов"
);

console.log(
    "Иконки товаров готовы"
);

console.log(
    "Группировка чеков по датам готова"
);

console.log(
    "================================"
);