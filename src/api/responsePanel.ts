// 天气预报信息
export interface RawCastInfo {
    date?: string;
    week?: string;
    dayweather?: string;
    daytemp?: string;
    daywind?: string;
    daypower?: string;
    nightweather?: string;
    nighttemp?: string;
    nightwind?: string;
    nightpower?: string;
}

// 天气预报信息
export interface WeatherForecastInfo {
    city: string;
    adcode: string;
    province: string;
    reporttime: string;
    casts: RawCastInfo[]
}

// 电影院商业信息
export interface BusinessInfo {
    business_area?: string;
    opentime_today?: string;
    opentime_week?: string;
    tel?: string;
    tag?: string;
    rating?: string;
    cost?: string;
    parking_type?: string;
}

// 电影院信息
export interface CinemaPoiInfo {
    name: string;
    id: string;
    location: string;
    address: string;
    pname: string;
    cityname: string;
    adname: string;
    pcode: string;
    adcode: string;
    citycode: string;
    business?: BusinessInfo;
}

// 种类信息
export interface GenreInfo {
    name: string;
    id: number;
}

// 种类信息
export interface MovieGenresInfo {
    genres : GenreInfo[];
}

// 电影信息
export interface MovieInfo {
    genre_ids: number[];
    id: number;
    original_title: string;
    title: string;
    overview: string;
    popularity: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    vote_count: number;
}

// 电影查询参数
export interface MovieQueryParams {
    primary_release_date_gte?: string     // >= 发布日期
    primary_release_date_lte?: string     // <= 发布日期
    vote_average_gte?: number             // 最低评分
    vote_average_lte?: number             //最高评分
    vote_count_gte?: number               // 最少投票数
    with_runtime_gte?: number             // 最短时长
    with_runtime_lte?: number             // 最长时长
    with_genres?: string                  // 类型id列表
    with_original_language?: string       // 原语言
    sort_by?: string                      // 排序方式
    page?: number                         // 页数
}

export interface MovieReviewInfo {
    author: string
    content: string
    id: string
    created_at: string
    url: string
}

export interface MovieCreditInfo {
    id: number
    name: string
    original_name: string
    profile_path: string
}
