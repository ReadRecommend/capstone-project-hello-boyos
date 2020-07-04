const apiUrl = "http://localhost:5000";

export default function getUserById(userId) {
    return fetch(`${apiUrl}/user/id/${userId}`)
}



