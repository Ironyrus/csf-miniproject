

export class User {
    constructor(
        public username_returned: string, 
        private _token: string,
        private _tokenExpiry: Date) 
        {}

    get token(){
        // If token has expired
        if(!this._tokenExpiry || new Date() > this._tokenExpiry) {
            return null;
        }
        return this._token;
    }
}