import Header from '.Header';
import  Footer from './Footer';
import type { LayoutProps } from '../types/types';

const Layout = ({children} : LayoutProps => {
    return (
        <>
            <Header />
            <div className = "container mx-auto min-h-[92vh] pt-24 px-4">
                {children}
            </div>
            <Footer />
        </>
    );
};

export default Layout;
