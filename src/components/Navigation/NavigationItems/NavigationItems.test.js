import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()})

describe('<NavigationItems />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });
    it('should render two <NavigationItem /> element if not auth', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render four <NavigationItem /> element if auth', () => {
        wrapper.setProps({ isAuth: true });
        expect(wrapper.find(NavigationItem)).toHaveLength(4);
    });

    it('should render logout NavigationItem element if auth', () => {
        wrapper.setProps({ isAuth: true });
        expect(wrapper.contains(<NavigationItem link='/logout'>Logout</NavigationItem>)).toEqual(true);
    });
});