export class ApiService {
    #baseUrl
    #Authorization
    #userEmail
    #userRole

    get baseUrl () {
        return this.#baseUrl;
    }

    get isAuth () {
        return !!this.#Authorization;
    }

    get role () {
        return this.#userRole;
    }

    get email () {
        return this.#userEmail;
    }

    constructor(host, port) {
        this.#baseUrl = `http://${host}:${port}/api`
        const prevAuthState = localStorage.getItem('token')
        if (prevAuthState) {
            this.#Authorization = prevAuthState;
            this.#userEmail = localStorage.getItem('email')
            this.#userRole = localStorage.getItem('role')
        }
    }

    async #get (path) {
        return fetch(`${this.baseUrl}/${path}`, {
            method:'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            }
        })
    }

    async #post (path, data) {
        return fetch(`${this.baseUrl}/${path}`, {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            },
            body: JSON.stringify(data)
        })
    }

    async #patch (path, data) {
        return fetch(`${this.baseUrl}/${path}`, {
            method:'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            },
            body: JSON.stringify(data)
        })
    }

    async #delete (path, params) {
        return fetch(`${this.baseUrl}/${path}?${new URLSearchParams(params)}`, {
            method:'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: this.#Authorization
            },
        })
    }

    async login (credentials) {
        try {
            const res = (await this.#post('users/login', credentials));
            const preparedData = await res.json();
            if (preparedData.jwt) {
                this.#Authorization = 'Bearer ' + preparedData.jwt;
                this.#userEmail = preparedData.email
                this.#userRole = preparedData.role
                localStorage.setItem('token', this.#Authorization);
                localStorage.setItem('role', this.role);
                localStorage.setItem('email', this.email);
            }
            return preparedData
        } catch (e) {
            return e
        }
    }

    logout () {
        this.#Authorization = undefined;
        localStorage.removeItem('token');

    }

    async todos () {
        try {
            const res = await this.#get('todos');
            return await res.json()
        } catch (e) {
            return e
        }
    }

    async markTodo (todo) {
        try {
                const res = await this.#patch('todos/todo', {...todo, done: !todo.done});
                return await res.json()
            } catch (e) {
                return e
            }
        }

    async addTodo (todo) {
        try {
            const res = await this.#post('todos/todo', todo);
            return await res.json()
        } catch (e) {
            return e
        }
    }

    async removeTodo (id) {
        try {
            const res = await this.#delete('todos/todo', { id });
            return await res.json()
        } catch (e) {
            return e
        }
    }
}