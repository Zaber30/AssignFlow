import api from "./api";

import type { ClassResponse } from "../types/ClassResponse";
import type { CreateClassRequest } from "../types/CreateClassRequest";

export const getClasses = async () => {

    const response = await api.get<ClassResponse[]>("/Classes");

    return response.data;

};

export const createClass = async (

    request: CreateClassRequest

) => {

    const response = await api.post(

        "/Classes",

        request

    );

    return response.data;

};