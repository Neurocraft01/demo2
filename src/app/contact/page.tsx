import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactClient from '@/components/contact/ContactClient';
import { getSiteContent } from '@/lib/content';

export default async function ContactPage() {
    const data = await getSiteContent<any>('contact');
    const { SITE_CONFIG } = await getSiteContent<any>('site');

    return (
        <>
            <Header />
            <ContactClient data={data} siteData={{ SITE_CONFIG }} />
            <Footer />
        </>
    );
}
