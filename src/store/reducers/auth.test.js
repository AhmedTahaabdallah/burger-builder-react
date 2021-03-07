import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth rreducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            user: null,
            loading: false,
            error: null,
            authRedirectPath: ['/', '/'],
        });
    });

    it('should return userData for authSuccess', () => {
        const userData = {
            username: 'ali',
            email: 'test1@tes.com',
            id: 'sdsdsd',
            tokken: 'authData.tokken',
        };
        expect(reducer({
            user: null,
            loading: false,
            error: null,
            authRedirectPath: ['/', '/'],
        }, {
            type: actionTypes.AUTH_SUCCESS,
            user: userData
        })).toEqual({
            user: userData,
            loading: false,
            error: null,
            authRedirectPath: ['/', '/'],
        });
    });
});