export interface IActiveUserModel {
    id: string;
    first_name: string;
    last_name: string;
    user_type: string;
    role: string;
    email: string;
    full_name: string;
    status: number;
    balance: number;
    image_url: string;
}

export class ActiveUserModel implements IActiveUserModel {
    id = "";
    first_name = "";
    last_name = "";
    user_type = "";
    role = "";
    full_name = "";
    email = "";
    status = 0;
    balance = 0;
    image_url = "";
}
