import {Outlet} from 'react-router-dom'

export default function RootLayout() {
    return (
        <div>
            <h1>Root Layout</h1>
            <main>
                 <Outlet />
            </main>
           
        </div>
    )
}