import { dataSource } from "./data-source";
import { User_Kasir } from "../entity/User_Kasir";


class Auth {
    username:string;
    password:string;
    logout:boolean;
    middle:boolean;

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    
    async goAuth():Promise<any>   {
        const username = this.username;
        const password = this.password;

        let service = await dataSource;
        const result = await service.manager.find(User_Kasir, {
            where: {
                username: username,
                password: password
            }
        })    
    
        if (result.length == 0) {
            return {"response": false, "data": null}; 
        } else {
            if (result[0].username === username && result[0].password === password) {
                return {"response": true, "data": result}; 
            } else {
                return {"response": false, "data": null}; 
            }
        }
    }
}

export default Auth

