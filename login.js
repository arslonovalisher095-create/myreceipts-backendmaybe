
function handleGoogleLogin(response) {

    console.log("Google вход выполнен");

    // Сохраняем Google credential
    localStorage.setItem(
        "googleCredential",
        response.credential
    );

    // Отправляем credential на Node.js сервер Render
    fetch(
        "https://myreceipts-backend-2.onrender.com/auth/google",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                credential: response.credential
            })
        }
    )

    .then(res => res.json())

    .then(data => {

        console.log(
            "Ответ сервера:",
            data
        );

        if (data.success) {

            // ==========================================
            // СОХРАНЯЕМ ПОЛЬЗОВАТЕЛЯ
            // ==========================================

            localStorage.setItem(
                "myReceiptsUser",
                JSON.stringify(data.user)
            );

            // Флаг входа
            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            console.log(
                "Пользователь сохранён:",
                data.user
            );

            console.log(
                "Переход на index.html"
            );

            // ==========================================
            // ПЕРЕХОД НА ГЛАВНУЮ
            // ==========================================

            window.location.href = "/index.html";

        } else {

            console.error(
                "Ошибка авторизации:",
                data.error
            );

            alert(
                "Ошибка входа: " +
                data.error
            );
        }

    })

    .catch(error => {

        console.error(
            "Ошибка соединения с сервером:",
            error
        );

        alert(
            "Не удалось подключиться к серверу"
        );
    });
}

