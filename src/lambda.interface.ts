import { Observable } from 'rxjs';

export interface LambdaService {
  process({
    body,
    language,
    testData,
  }: {
    body: string;
    language: string;
    testData: string;
  }): Observable<any>;
}
