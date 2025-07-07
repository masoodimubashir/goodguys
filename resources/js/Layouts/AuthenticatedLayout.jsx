import { SideBar } from '@/Components/SideBar';
import { Header } from '@/Components/Header';
import Footer from '@/Components/Footer';


export default function AuthenticatedLayout({ children }) {

    return (
        <>

            <div className="app-wrapper">

                <SideBar/>

                <div className="app-content">

                    <Header/>

                    <main>
                        <div className="container-fluid ">
                            {children}
                        </div>
                    </main>

                </div>


        
            </div>

        </>
    );
}



