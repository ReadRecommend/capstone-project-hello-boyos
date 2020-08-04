const apiUrl = "http://localhost:5000";

// ===== AUTH =====

export function verifyUser() {
    return fetch(`${apiUrl}/auth/verify`, {
        credentials: "include",
    });
}

export function refreshToken() {
    return fetch(`${apiUrl}/auth/refresh`, {
        credentials: "include",
    });
}

export function createAccount(username, email, password) {
    const data = {
        username: username,
        email: email,
        password: password,
    };
    return fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
}

export function logIn(username, password) {
    const data = {
        username: username,
        password: password,
    };
    return fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
}

// ===== USERS =====

export function getAllUsers() {
    return fetch(`${apiUrl}/user`);
}

export function getUserById(userId) {
    return fetch(`${apiUrl}/user/id/${userId}`);
}

export function searchUsers(search) {
    const data = {
        search: search,
    };
    return fetch(`${apiUrl}/search/users`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
}

export function deleteUser(userID) {
    return fetch(`${apiUrl}/user/${userID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userID }),
        credentials: "include",
    });
}

// ===== BOOKS =====

export function getAllBooks() {
    return fetch(`${apiUrl}/book`);
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

export function bookSearch(searchQuery, filter) {
    const data = {
        search: searchQuery,
        filter: filter,
    };
    return fetch(`${apiUrl}/search`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
}

// ===== REVIEWS =====

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

export function addReview(readerId, bookId, score, review) {
    const data = {
        reader_id: readerId,
        book_id: bookId,
        score: score,
        review: review,
    };
    return fetch(`${apiUrl}/book/review`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
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

// ===== COLLECTIONS =====

export function addToCollection(bookID, collectionID) {
    return fetch(`${apiUrl}/collection/modify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            book_id: bookID,
            collection_id: collectionID,
        }),
        credentials: "include",
    });
}

export function getCollection(id) {
    return fetch(`${apiUrl}/collection/${id}`);
}

export function deleteCollection(readerId, collectionName) {
    const data = { reader_id: readerId, name: collectionName };
    return fetch(`${apiUrl}/collection`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });
}

export function addCollection(readerId, collectionName) {
    const data = { reader_id: readerId, name: collectionName };
    return fetch(`${apiUrl}/collection`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });
}

export function removeFromCollection(bookId, collectionId) {
    const data = { book_id: bookId, collection_id: collectionId };
    return fetch(`${apiUrl}/collection/modify`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });
}

export function getCollectionOverview(username, overviewName) {
    return fetch(`${apiUrl}/user/${username}/${overviewName}`);
}

// ===== FOLLOWERS =====

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

// ===== GOALS =====

export function getGoals(year) {
    return fetch(`${apiUrl}/goals/${year}`, {
        credentials: "include",
    });
}

export function updateGoal(month, year, goal) {
    return fetch(`${apiUrl}/goals`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            month: month,
            year: year,
            goal: goal,
        }),
        credentials: "include",
    });
}

// ===== RECOMMENDATIONS =====

export function getRecommendations(
    mode,
    userID,
    bookID,
    nRecommend = 10,
    bookIDs = null,
    author = null,
    genre = null
) {
    return fetch(`${apiUrl}/recommendations/${mode}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID: userID,
            bookID: bookID,
            n_recommend: nRecommend,
            bookIDs: bookIDs,
            author: author,
            genre: genre,
        }),
        credentials: "include",
    });
}
