import React from 'react';

export const useHttp = () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const request = React.useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setLoading(true);
            try {
                if (body) {
                    body = JSON.stringify(body);
                    headers['Content-Type'] = 'application/json';
                }

                const res = await fetch(url, {
                    method,
                    body,
                    headers
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Something went wrong');
                }
                setLoading(false);

                return data;
            } catch (error) {
                setLoading(false);
                setError(error.message || 'Something went wrong');
                throw error;
            }
        },
        []
    );

    const clearError = () => setError(null);

    return { loading, request, error, clearError };
};
