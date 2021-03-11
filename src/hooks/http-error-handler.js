import { useState, useEffect } from 'react';

export default httpClint => {
    const [ error, setError ] = useState(null);
        
    const reqInterceptor = httpClint.interceptors.request.use(req => {
        setError(null);
        return req;
    });
    const resInterceptor = httpClint.interceptors.response.use(res => res, err => {
        setError(err);
    });

    useEffect(() => {
        return () => {
            httpClint.interceptors.request.eject(reqInterceptor);
            httpClint.interceptors.response.eject(resInterceptor);
        }
    }, [ reqInterceptor, resInterceptor ]);

    const errorConfirmedHandler = () => {
        setError(null);
    };

    return [ error, errorConfirmedHandler ];
}