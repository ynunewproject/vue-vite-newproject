import axios from './index';

export const getUsers = () => {
    return axios.get(`http://127.0.0.1:8000/api/v1/UserInfo/`);
};

export const postUser = (username, password) => {
    return axios.post(`http://127.0.0.1:8000/api/v1/UserInfo/`, { 'username': username, 'password': password });
};

export const get_csrf_token = ()=>{
    return axios.get('http://127.0.0.1:8000/api/v1/getcsrf/')
};

export const login = (phone, password,config)=>{
    return axios.post('http://127.0.0.1:8000/login/',{ 'phone':phone, 'password': password },config)
}

export const register = (username, password,config)=>{
    return axios.post('http://127.0.0.1:8000/api/v1/register/',{ 'username': username, 'password': password },config)
}

export const updatePwd = (username,OldPwd,NewPwd)=>{
    return axios.put('http://127.0.0.1:8000/api/v1/updatepwd/',{ 'username': username, 'OldPwd': OldPwd ,'NewPwd':NewPwd})
}

export const PredictMethods = (predictData,config)=>{
    return axios.post("http://127.0.0.1:8000/index/postFileData/",predictData,config)
}

export const GetBaseCode = (config)=>{
    return axios.get("https://5f3d-39-129-5-19.ngrok-free.app/vueTest/",config)
}

/*export const GetData = ()=>{
    return axios.get("")
}*/
export async function getData(params={}) {
    try {
        return await axios.get('http://localhost:8000/api/v1/MushroomInfo/', {
            params: params,
        });
    } catch (error) {
        throw error;
    }
}


export const getMushroomList =async ()=>{
    try {
        return await axios.get('http://localhost:8000/api/v1/MushroomInfo/');
    } catch (error){
        throw error;
    }
}


//获取动态
export const getMomentsList = (orderBy="creatTime")=>{
    return axios.get(`http://127.0.0.1:8000/index/moments/?orderBy=${orderBy}`)
}

export const getMomentsDetail = (pk)=>{
    return axios.get(`http://127.0.0.1:8000/index/moments/details/${pk}/`)
}

export const getComments = (pk,token)=>{
    return axios.get(`http://127.0.0.1:8000/index/moments/details/comments/${pk}/?token=${token}`)
}

//此方法无效
export const submitNewMoment = (momentObj,config)=>{
    return axios.post('http://127.0.0.1:8000/index/moments/?token=216c3a01-6ff6-11ee-b4b2-b025aa47fd41', momentObj,config)
}

export const submitNewCommentAPI = (pk,content,token)=>{
    return axios.post(`http://127.0.0.1:8000/index/moments/details/comments/${pk}/?token=${token}`, {content})
}

export const getMyFavorsAPI = (token)=>{
    return axios.get(`http://127.0.0.1:8000/index/moments/myFavorList/?token=${token}`)
}
export const addFavorAPI = (moment_id,token)=>{
    return axios.post(`http://127.0.0.1:8000/index/moments/myFavorList/?token=${token}`, {moment_id})
}

export const deleteCommentAPI = (comment_id,token)=>{
    return axios.delete(`http://127.0.0.1:8000/index/moments/details/comments/delete/${comment_id}/?token=${token}`)
}

export const getHistoricalRecords = (token) =>{
    return axios.get(`http://127.0.0.1:8000/index/recordList/?token=${token}`)
}
export const deleteHistoricalRecords = (id) =>{
    return axios.delete(`http://127.0.0.1:8000/index/recordList/deleteRecords/${id}/`)
}

