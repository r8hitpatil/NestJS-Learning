export interface RedisAsyncOptions {
    imports?: any[];
    inject?:any[];
    useFactory: (...args:any[]) => Promise<string> | string;
}