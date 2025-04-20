import { useEffect, useState } from "react";
import { ApiState } from "../types";



/* export function useApiRequest<T>(requestFn: () => Promise<T>) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await requestFn();
        if (isMounted) setState({ data, loading: false, error: null });
      } catch (err: any) {
        if (isMounted)
          setState({
            data: null,
            loading: false,
            error: err.message || "",
          });
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [requestFn]);

  return state;
} */


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