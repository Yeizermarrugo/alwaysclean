import { Head } from '@inertiajs/react';
import Header from '@/Components/Site/Header';
import Footer from '@/Components/Site/Footer';
import WhatsAppFloat from '@/Components/Site/WhatsAppFloat';

export default function SiteLayout({ title, showActions = true, compact = false, children }) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col bg-white">
                <Header showActions={showActions} compact={compact} />
                <main className="flex-1">{children}</main>
                <Footer />
                <WhatsAppFloat />
            </div>
        </>
    );
}
