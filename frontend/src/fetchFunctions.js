const apiUrl = "http://localhost:5000";

export function getUserById(userId) {
    return fetch(`${apiUrl}/user/id/${userId}`);
}

export function verifyUser() {
    return fetch(`${apiUrl}/verify`, {
        credentials: "include",
    });
}

export function getBook(bookISBN) {
    return fetch(`${apiUrl}/book/${bookISBN}`);
}

