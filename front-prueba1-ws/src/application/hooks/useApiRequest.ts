import { useState } from "react";



  export type ApiState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
  }


//hook personalizado con variables de loading y error. Se crea una instancia diferente de él cada vez que se usa en un comp
  export function useApiRequest<T>(): {
    dataApi: T | null;
    loading: boolean;
    errorApi: string | null;
    execute: (apiCall: () => Promise<T>) => Promise<void>;
  } {
    const [dataApi, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorApi, setError] = useState<string | null>(null);
  
    const execute = async (apiCall: () => Promise<T>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiCall();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    return { dataApi, loading, errorApi, execute };
  }