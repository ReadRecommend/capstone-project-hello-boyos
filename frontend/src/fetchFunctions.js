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

export function getReview(bookISBN) {
    return fetch(`${apiUrl}/book/${bookISBN}/reviews`);
}

export function addToCollection(isbn, id) {
    console.log("ISBN and Col id are: " + isbn + " and " + id);
    fetch("http://localhost:5000/modify_collection", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            book_id: isbn,
            collection_id: id,
        }),
        credentials: "include",
    })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            console.log(json);
            return json;
        });
}
