const apiUrl = "http://localhost:5000";

export function getUserById(userId) {
    return fetch(`${apiUrl}/user/id/${userId}`);
}

export function verifyUser() {
    return fetch(`${apiUrl}/auth/verify`, {
        credentials: "include",
    });
}

export function getBook(bookID) {
    return fetch(`${apiUrl}/book/${bookID}`);
}

export function deleteBook(bookID) {
    return fetch(`${apiUrl}/book`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bookID }),
        credentials: "include",
    });
}

export function getAllBooks() {
    return fetch(`${apiUrl}/book`);
}

export function getReview(bookID, reviewPage, nReviews) {
    const data = {
        page: reviewPage,
        reviews_per_page: nReviews,
    };
    return fetch(`${apiUrl}/book/${bookID}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function getReviewPages(bookID, nReviews) {
    const data = {
        reviews_per_page: nReviews,
    };
    return fetch(`${apiUrl}/book/${bookID}/reviewpage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function addBook(bookDetails) {
    return fetch(`${apiUrl}/book`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bookDetails),
        credentials: "include",
    });
}

export function addToCollection(bookID, collectionID) {
    fetch(`${apiUrl}/collection/modify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            book_id: bookID,
            collection_id: collectionID,
        }),
        credentials: "include",
    })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            return json;
        });
}

export function unfollowUser(followerUsername, userUsername) {
    return fetch(`${apiUrl}/user/follow`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: userUsername,
            follower: followerUsername,
        }),
        credentials: "include",
    })
        .then((res) => {
            if (!res.ok) {
                return res.text().then((text) => {
                    throw Error(text);
                });
            }

            return res.json();
        })
        .catch((error) => {});
}

export function followUser(followerUsername, userUsername) {
    return fetch(`${apiUrl}/user/follow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: userUsername,
            follower: followerUsername,
        }),
        credentials: "include",
    })
        .then((res) => {
            if (!res.ok) {
                return res.text().then((text) => {
                    throw Error(text);
                });
            }

            return res.json();
        })
        .catch((error) => {});
}

export function getGoals(year) {
    return fetch(`${apiUrl}/goals/${year}`, {
        credentials: "include",
    });
}

export function updateGoal(month, year, goal, n_read) {
    return fetch(`${apiUrl}/goals`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            month: month,
            year: year,
            goal: goal,
            n_read: n_read,
        }),
        credentials: "include",
    });
}

export function getCollectionOverview(username, overviewName) {
    return fetch(`http://localhost:5000/user/${username}/${overviewName}`);
}

export function getRecommendations(
    mode,
    userID,
    bookID,
    nRecommend = 10,
    author = null,
    genre = null
) {
    return fetch(`http://localhost:5000/recommendations/${mode}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID: userID,
            bookID: bookID,
            nRecommend: nRecommend,
            author: author,
            genre: genre,
        }),
        credentials: "include",
    });
}
