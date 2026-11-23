import { Observable } from 'rxjs';

export interface UseCase<T> {
  execute(): Observable<T>;
}

export interface UseCasePromise<T> {
  execute(): Promise<T>;
}

export interface UseCaseParam<S, T> {
  execute(params: S): Observable<T>;
}

export interface UseCaseParamValue<S, T> {
  execute(params: S): T;
}

export interface UseCaseParamPromise<S, T> {
  execute(params: S): Promise<T>;
}

export interface UseCaseMultiParam<S, T> {
  execute(...params: S[]): Observable<T>;
}