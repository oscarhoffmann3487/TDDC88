import { User } from "./User";

export interface Card {
    id?: number,
    owner_id: number,
    center: number,
    unit: string,
    title: string,
    department: string,
    description: string,
    owner: User,
    numberOfComments: number,
    numberOfLikes: number,
    pdsaTag: string,
    problem: string, 
    goal: string,
    how: string, 
    ideas: string, 
    how_goal: string, 
    plan: string, 
    planned_time: string, 
    improvment: string,
    time: string,
    trends: string,
    effects: string,
    evaluate_changes: string, 
    teachings: string, 
    evaluate_plan: string,
    improvment_plan: string,
    evaluate_do: string,
    next_step: string, 
    spreading: string,
    created_at: string,
    maintain: string,
    future: string ,
    archive: string,
    archive_date: string
}

export type CardList = Card[];