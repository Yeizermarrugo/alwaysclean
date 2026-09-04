import { Head } from '@inertiajs/react';
import Header from '@/Components/Site/Header';
import Footer from '@/Components/Site/Footer';

export default function SiteLayout({ title, showTopbar = false, showActions = true, compact = false, children }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-white">
                <Header showTopbar={showTopbar} showActions={showActions} compact={compact} />
                <main>{children}</main>
                <Footer />
            </div>
        </>
    );
}
