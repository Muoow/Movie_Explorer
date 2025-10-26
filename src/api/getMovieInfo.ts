import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMovieGenresInfo(): Promise<any> {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list?language=zh-CN`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_APP_MOVIE_KEY}`,
            },
        });

        const data = response.data;

        return data;
    }
    catch (error) {
        console.error(error);
        throw new Error();
    }
}

import { type MovieQueryParams } from "@/api/responsePanel.ts";

export async function fetchMoviesInfo(params: MovieQueryParams): Promise<any> {
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            params: {
                language: 'zh-CN',
                "primary_release_date.gte": params.primary_release_date_gte,
                "primary_release_date.lte": params.primary_release_date_lte,
                "vote_average.gte": params.vote_average_gte,
                "vote_average.lte": params.vote_average_lte,
                "vote_count.gte": params.vote_count_gte,
                "with_runtime.gte": params.with_runtime_gte,
                "with_runtime.lte": params.with_runtime_lte,
                with_genres: params.with_genres,
                with_original_language: params.with_original_language,
                sort_by: params.sort_by || "popularity.desc",
                page: params.page || 1,
            },
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_APP_MOVIE_KEY}`,
            },
        })

        return response.data
    }
    catch (error) {
        console.error(error)
        throw new Error()
    }
}

export async function fetchMoviesInfoByKeyword(
    keyword: string,
    page?: number,
    region?: string,
    year?: string): Promise<any> {
    try {
        const res = await axios.get(
            'https://api.themoviedb.org/3/search/movie',
            {
                params: {
                    query: keyword,
                    page: page,
                    region: region,
                    year: year,
                    language: 'zh-CN',
                },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_APP_MOVIE_KEY}`,
                }
            }
        )

        return res.data
    }
    catch (error) {
        console.error(error)
        throw new Error()
    }
}

export async function fetchMoviesInfoByType(
    type: "now_playing" | "popular" | "top_rated" | "upcoming",
    page: number = 1): Promise<any> {
    try {
        const res = await axios.get(
            `https://api.themoviedb.org/3/movie/${type}`,
            {
                params: {
                    language: 'zh-CN',
                    page: page,
                },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_APP_MOVIE_KEY}`,
                }
            }
        )

        return res.data
    }
    catch (error) {
        console.error(error)
        throw new Error()
    }
}

export async function fetchMovieReviews(id: number): Promise<any> {
    try {
        const res = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/reviews`,
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_APP_MOVIE_KEY}`,
                }
            }
        )

        return res.data
    }
    catch (error) {
        console.error("获取评论失败：", error)
        throw new Error()
    }
}

export async function fetchMovieCredits(id: number): Promise<any> {
    try {
        const res = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits`,
            {
                params: {
                    language: 'zh-CN',
                },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_APP_MOVIE_KEY}`,
                }
            }
        )

        return res.data
    }
    catch (error) {
        console.error("获取演职人员数据失败：", error)
        throw new Error()
    }
}

export async function fetchSimilarMovies(id: number) {
    try {
        const res = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/similar`,
            {
                params: {
                    language: 'zh-CN',
                },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_APP_MOVIE_KEY}`,
                }
            }
        )

        return res.data
    }
    catch (error) {
        console.error("获取类似电影数据失败：", error)
        throw new Error()
    }
}
