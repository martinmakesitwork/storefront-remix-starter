import { RootLoaderData } from '~/root';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

const navigation = {
  support: [
    { page: 'help', href: '#' },
    { page: 'trackOrder', href: '#' },
    { page: 'shipping', href: '#' },
    { page: 'returns', href: '#' },
  ],
  company: [
    { page: 'about', href: '#' },
    { page: 'blog', href: '#' },
    { page: 'responsibility', href: '#' },
    { page: 'press', href: '#' },
  ],
};

export default function Footer({
  collections,
}: {
  collections: RootLoaderData['collections'];
}) {
  const { t } = useTranslation();

  return (
    <footer
      className="mt-24 border-t bg-gray-50"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        {t('footer.title')}
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 ">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                  {t('footer.shop')}
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {collections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        className="text-base text-gray-500 hover:text-gray-600"
                        to={'/collections/' + collection.slug}
                        prefetch="intent"
                        key={collection.id}
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                  {t('footer.support')}
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.support.map(({ page, href }) => (
                    <li key={page}>
                      <a
                        href={href}
                        className="text-base text-gray-500 hover:text-gray-600"
                      >
                        {t(`navigation.support.${page}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                  {t('account.company')}
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map(({ page, href }) => (
                    <li key={page}>
                      <a
                        href={href}
                        className="text-base text-gray-500 hover:text-gray-600"
                      >
                        {t(`navigation.company.${page}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 xl:mt-0">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              {t('footer.subscribeHeader')}
            </h3>
            <p className="mt-4 text-base text-gray-500">
              {t('footer.subscribeIntro')}
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                {t('acount.emailAddress')}
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400"
                placeholder={t('footer.emailPlaceholder')}
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full bg-primary-500 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500"
                >
                  {t('footer.subscribe')}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <a
            className="flex items-center space-x-4 font-medium text-gray-500 hover:text-gray-700"
            href="http://united-automationhub.com/"
          >
<svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M52.3542 6.68256C52.6852 6.14243 53.0511 5.63714 53.417 5.14928C52.5458 4.36522 51.5875 3.65085 50.5421 3.0236C42.9454 -1.47169 33.4147 0.601718 28.8323 7.50147C28.6232 7.81509 28.4315 8.12872 28.2399 8.44234C27.6475 9.47034 26.6021 11.7354 26.2536 14.2444C26.2536 14.2793 26.2188 14.5406 26.2188 14.5232C26.6718 14.7497 27.1422 14.9936 27.5778 15.255C32.195 17.7291 44.287 18.5655 52.3542 6.66514V6.68256Z" fill="black"/>
<path d="M57.3374 8.54679C62.5122 14.1398 63.7841 22.4857 59.8464 29.1763C57.3548 33.8633 56.1352 46.1295 71.4331 56.0087C72.0081 56.2004 72.5308 56.4269 73.0012 56.6534C73.2626 56.7754 73.5065 56.9322 73.7679 57.0716C79.6745 60.3298 86.975 59.2147 91.993 54.6845C91.8362 54.5626 90.5642 53.7088 90.5642 53.7088C78.176 45.2061 78.7859 32.3997 81.5388 27.0855C81.6085 26.9461 81.6956 26.8067 81.7653 26.6673C85.9121 19.4365 83.5251 10.202 76.3291 5.91582C70.0392 2.16974 62.1463 3.44167 57.3374 8.54679Z" fill="black"/>
<path d="M93.3172 52.4719C93.8573 52.803 94.3626 53.1689 94.8505 53.5348C95.6345 52.681 96.3489 51.7053 96.9762 50.6599C101.332 43.2897 99.4852 33.2188 92.0279 28.6364C91.8536 28.5319 91.6968 28.4273 91.4703 28.3054C90.4075 27.713 88.2121 26.7024 85.7728 26.3714C85.7379 26.3714 85.4417 26.3365 85.4417 26.3191C85.3895 26.4062 85.3546 26.5108 85.3023 26.5979C85.1281 26.9638 84.919 27.3122 84.7099 27.6781C82.2358 32.2954 81.3994 44.3874 93.2998 52.4545L93.3172 52.4719Z" fill="black"/>
<path d="M91.4528 57.455C85.8599 62.6298 77.514 63.9017 70.8233 59.964C66.1363 57.4724 53.8701 56.2527 43.9909 71.5507C43.7644 72.2128 43.5031 72.8749 43.1546 73.4847C39.6176 79.461 40.6804 86.9706 45.3151 92.1105C45.4371 91.9537 46.2908 90.6818 46.2908 90.6818C54.7587 78.3459 67.4954 78.9034 72.8444 81.6215C72.9664 81.6912 73.0884 81.7435 73.2103 81.8132C80.4585 86.0645 89.7802 83.6775 94.0838 76.4467C97.8299 70.1568 96.558 62.2639 91.4528 57.455Z" fill="black"/>
<path d="M47.5279 93.4347C47.1969 93.9748 46.831 94.4801 46.4651 94.968C47.3363 95.752 48.2946 96.4664 49.34 97.0937C56.5359 101.345 66.3106 99.6898 71.015 92.6681C71.224 92.3544 71.4331 92.0234 71.6248 91.6923C72.2172 90.6818 73.2626 88.4167 73.6111 85.9077C73.6111 85.8032 73.6459 85.6986 73.6459 85.5941C73.6459 85.5941 72.4263 84.9494 72.2869 84.8623C67.6696 82.3881 55.5776 81.5518 47.5105 93.4521L47.5279 93.4347Z" fill="black"/>
<path d="M42.5447 91.5705C37.3699 85.9775 36.098 77.6316 40.0357 70.941C42.5273 66.254 43.747 53.9878 28.449 44.1086C27.7869 43.8821 27.1074 43.6382 26.515 43.2723C20.5387 39.7353 13.0291 40.7981 7.88916 45.4328C8.04597 45.5548 9.3179 46.4085 9.3179 46.4085C21.6364 54.859 21.1137 67.5608 18.3956 72.9273C18.3085 73.0841 18.2214 73.2409 18.1342 73.3977C13.9526 80.6285 16.3396 89.8979 23.5356 94.2015C29.8255 97.9476 37.7184 96.6756 42.5273 91.5705H42.5447Z" fill="black"/>
<path d="M6.56498 47.6456C6.02485 47.3146 5.51957 46.9487 5.0317 46.5828C4.24764 47.4365 3.53327 48.4122 2.90602 49.4577C-1.57184 57.0369 0.466718 66.5502 7.33162 71.1501C7.66267 71.3766 8.01114 71.5857 8.37704 71.7947C9.43988 72.4046 11.6875 73.4326 14.1965 73.7636C14.2314 73.7636 14.4405 73.781 14.423 73.7984C14.6495 73.3454 14.8935 72.875 15.1548 72.4394C17.629 67.8221 18.4653 55.7302 6.56498 47.663V47.6456Z" fill="black"/>
<path d="M8.42936 42.6624C14.0223 37.4876 22.3682 36.2157 29.0589 40.1534C33.7459 42.645 46.0121 43.8646 55.8913 28.5667C56.1004 27.9395 56.3443 27.3645 56.6056 26.8418C56.6753 26.685 56.7625 26.5456 56.8496 26.3887C60.2123 20.4473 59.1321 13.0597 54.5497 8.00684C54.2709 8.37273 54.0095 8.75605 53.7656 9.13937C53.6611 9.31361 53.5391 9.47042 53.4346 9.64466C44.9667 21.7715 32.3346 21.1965 27.0204 18.4784C26.8461 18.3913 26.6719 18.2868 26.4976 18.1822C19.2843 14.0877 10.0672 16.4747 5.79839 23.6358C2.05231 29.9257 3.32424 37.8186 8.42936 42.6276V42.6624Z" fill="black"/>
</svg>

            <span>Powered by United Automation Hub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
