import { AxiosRequestConfig } from "axios";
import { apiRequestWithToken } from "../../config/api";

export const getProfilePicture = async (id: number): Promise<any> => {
    const config: AxiosRequestConfig = {
        url: "/api/user/profile-image/" + id,
        method: "GET",
    };
    return apiRequestWithToken<any>(config);
}


export const changeProfilePicture = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("image", file);
    const config: AxiosRequestConfig = {
        url: "/api/user/upload-profile-image",
        method: "POST",
        data: formData,
    };
    return apiRequestWithToken<any>(config);

}