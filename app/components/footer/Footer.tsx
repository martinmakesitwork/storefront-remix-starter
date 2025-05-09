import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
// Assuming NewsletterSignup component exists or will be created
import { NewsletterSignup } from '~/components/newsletter-signup'; // Or the correct path

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.quickLinks', 'Quick links')}</h3>
            <ul className="space-y-2">
              <li><Link to="/search" className="hover:underline">{t('common.search', 'Suchen')}</Link></li>
              {/* Add other quick links here */}
            </ul>
            <div className="mt-8">
              <p className="font-semibold">+49 15 15 / 058 65 76</p>
              <a href="mailto:hello@domain.com" className="hover:underline">info@sojka.group</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.information', 'Information')}</h3>
            <ul className="space-y-2">
               <li><Link to="/search" className="hover:underline">{t('common.search', 'Suchen')}</Link></li>
              {/* Add other information links here */}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.newsletter.title', 'Stay in the loop with our weekly newsletter')}</h3>
            <NewsletterSignup />
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} {t('footer.copyright', 'UAH Connect. Powered by SOJKA Group.')}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/datenschutzerklaerung" className="text-sm hover:underline">{t('footer.privacy', 'Datenschutzerklärung')}</Link>
            <Link to="/cookie-einstellungen" className="text-sm hover:underline">{t('footer.cookies', 'Cookie-Einstellungen')}</Link>
          </div>
          <div className="mt-4 md:mt-0">
            {/* Placeholder for payment icons */}
            <span className="sr-only">PayPal</span>
            <div className="h-8 w-12 bg-white rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
