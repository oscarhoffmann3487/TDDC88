export interface User {
    has_id: number,
    auth_lvl: number,
    center?: number,
    unit?: number,
    place?: number,
    first_name: string,
    last_name: string,
    email?: string,
    profession: string,
}

export type UserList = User[];
