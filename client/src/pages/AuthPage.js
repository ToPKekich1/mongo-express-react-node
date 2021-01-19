import React from 'react';
import { useHttp } from '../hooks/http.hook';

export const AuthPage = () => {
    const { loading, request } = useHttp();

    const [form, setForm] = React.useState({
        email: '',
        password: ''
    });

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {
                ...form
            });
            console.log('Data: ', data);
        } catch (error) {}
    };

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Cut the Link</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authentication</span>
                        <div>
                            <div className="input-field ">
                                <input
                                    onChange={changeHandler}
                                    placeholder="Enter your email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field ">
                                <input
                                    onChange={changeHandler}
                                    placeholder="Enter your password"
                                    id="password"
                                    type="text"
                                    name="password"
                                    className="yellow-input"
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yelloww darken-4"
                            disabled={loading}
                            style={{ marginRight: 10 }}>
                            Sign in
                        </button>
                        <button
                            onClick={registerHandler}
                            disabled={loading}
                            className="btn grey lighten-1 black-text">
                            Registrate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
