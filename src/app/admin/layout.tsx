import { ReactNode } from 'react';
import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
    title: 'AKS Automations | Admin Dashboard',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="admin-body">
            {children}
        </div>
    );
}
