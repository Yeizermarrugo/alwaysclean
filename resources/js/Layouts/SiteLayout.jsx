import { Head } from '@inertiajs/react';
import Header from '@/Components/Site/Header';
import Footer from '@/Components/Site/Footer';
import WhatsAppFloat from '@/Components/Site/WhatsAppFloat';
import PedidoDrawer from '@/Components/Site/PedidoDrawer';

export default function SiteLayout({ title, showActions = true, compact = false, children }) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-pantalla flex-col bg-white">
                <Header showActions={showActions} compact={compact} />
                <main className="flex flex-1 flex-col">{children}</main>
                <Footer />
                <WhatsAppFloat />
                <PedidoDrawer />
            </div>
        </>
    );
}
