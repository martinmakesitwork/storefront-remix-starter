import { Link } from '@remix-run/react';
// import { SearchBar } from '~/components/header/SearchBar'; // Assuming this is not used in the provided snippet but kept for completeness
import { useRootLoader } from '~/utils/use-root-loader';
// import { useScrollingUp } from '~/utils/use-scrolling-up'; // Hook available, not currently used
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect, useCallback } from 'react';

// --- SVG Icons (unchanged) ---
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
    <path strokeLinecap="round" d="m21 21-3.636-3.636m0 0A9 9 0 1 0 4.636 4.636a9 9 0 0 0 12.728 12.728Z" fill="none" stroke="#171717"></path>
  </svg>
);
const UserIconSvg = () => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
    <rect width="10.5" height="10.5" x="6.75" y="1.75" stroke="#171717" rx="5.25"></rect>
    <path strokeLinecap="round" stroke="#171717" d="M12 15.5c1.5 0 4 .333 4.5.5.5.167 3.7.8 4.5 2 1 1.5 1 2 1 4m-10-6.5c-1.5 0-4 .333-4.5.5-.5.167-3.7.8-4.5 2-1 1.5-1 2-1 4"></path>
  </svg>
);
const CartIconSvg = () => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h.5v0c.226 0 .339 0 .44.007a3 3 0 0 1 2.62 1.976c.034.095.065.204.127.42l.17.597m0 0 1.817 6.358c.475 1.664.713 2.496 1.198 3.114a4 4 0 0 0 1.633 1.231c.727.297 1.592.297 3.322.297h2.285c1.75 0 2.626 0 3.359-.302a4 4 0 0 0 1.64-1.253c.484-.627.715-1.472 1.175-3.161l.06-.221c.563-2.061.844-3.092.605-3.906a3 3 0 0 0-1.308-1.713C19.92 4 18.853 4 16.716 4H4.857ZM12 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" fill="none" stroke="#171717"></path>
  </svg>
);
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 transition-transform group-hover/footer:translate-x-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

// --- Interfaces for MegaMenu data (unchanged) ---
export interface MegaMenuLink {
  text: string;
  href: string;
}
export interface MegaMenuColumn {
  title: string;
  links: MegaMenuLink[];
}
export interface MegaMenuData {
  triggerText: string;
  columns: MegaMenuColumn[];
  footerLink?: {
    text: string;
    href: string;
  };
}

// --- Header Props Interface ---
interface HeaderProps {
  onCartIconClick: () => void;
  cartQuantity: number;
  marketplaceMenuData?: MegaMenuData;
  connectMenuData?: MegaMenuData;
}

const DROPDOWN_ANIMATION_DURATION = 250; // ms for the main dropdown slide
const CONTENT_ANIMATION_DURATION = 400; // ms for the inner content (columns) - should match tailwind.config.js
const CLOSE_DELAY = 150; // ms, delay before starting to close menu on mouse leave

export function Header({
  onCartIconClick,
  cartQuantity,
  marketplaceMenuData,
  connectMenuData,
}: HeaderProps) {
  const rootData = useRootLoader();
  const shopBaseUrl = "http://localhost:3000";
  const isSignedIn = !!rootData.activeCustomer.activeCustomer?.id;

  const [activeTriggerText, setActiveTriggerText] = useState<string | null>(null);
  const [currentVisibleMenu, setCurrentVisibleMenu] = useState<MegaMenuData | null>(null);
  const [isDropdownShellVisible, setIsDropdownShellVisible] = useState(false);
  // Key to force re-render (and thus re-animation) of content when switching menus
  const [contentAnimationKey, setContentAnimationKey] = useState(0);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Timeout to clear content *after* the dropdown shell has animated out
  const clearContentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = useCallback((menuData: MegaMenuData) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (clearContentTimeoutRef.current) clearTimeout(clearContentTimeoutRef.current);

    setActiveTriggerText(menuData.triggerText);

    if (currentVisibleMenu?.triggerText !== menuData.triggerText) {
      // If switching or opening for the first time with new data
      setCurrentVisibleMenu(menuData);
      setContentAnimationKey(prevKey => prevKey + 1); // Trigger content animation
    }

    if (!isDropdownShellVisible) {
        setIsDropdownShellVisible(true); // Show and animate shell if it's not already visible
    }
  }, [currentVisibleMenu, isDropdownShellVisible]);

  const startMenuClose = useCallback(() => {
    setIsDropdownShellVisible(false); // Start animating shell out
    setActiveTriggerText(null);

    if (clearContentTimeoutRef.current) clearTimeout(clearContentTimeoutRef.current);
    clearContentTimeoutRef.current = setTimeout(() => {
      setCurrentVisibleMenu(null); // Clear content after shell animation
    }, DROPDOWN_ANIMATION_DURATION);
  }, []);

  const handleTriggerEnter = useCallback((menuData: MegaMenuData | undefined) => {
    if (!menuData) return;
    openMenu(menuData);
  }, [openMenu]);

  const handleGenericLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      startMenuClose();
    }, CLOSE_DELAY);
  }, [startMenuClose]);

  const handleDropdownEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    // If mouse enters dropdown, and there's content, ensure trigger is marked
    if (currentVisibleMenu) {
      setActiveTriggerText(currentVisibleMenu.triggerText);
    }
    // Keep the shell visible
    setIsDropdownShellVisible(true);
    if (clearContentTimeoutRef.current) clearTimeout(clearContentTimeoutRef.current);

  }, [currentVisibleMenu]);


  const onLinkClickAndCloseMenu = useCallback(() => {
    setIsDropdownShellVisible(false);
    setActiveTriggerText(null);
    if (clearContentTimeoutRef.current) clearTimeout(clearContentTimeoutRef.current);
    // Clear content a bit faster on direct click, or let the timeout handle it
    setCurrentVisibleMenu(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (clearContentTimeoutRef.current) clearTimeout(clearContentTimeoutRef.current);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownShellVisible) {
        startMenuClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isDropdownShellVisible, startMenuClose]);


  const getMenuDataByTrigger = (triggerText: string | null): MegaMenuData | undefined => {
    if (!triggerText) return undefined;
    if (marketplaceMenuData && triggerText === marketplaceMenuData.triggerText) return marketplaceMenuData;
    if (connectMenuData && triggerText === connectMenuData.triggerText) return connectMenuData;
    return undefined;
  }

  return (
    <header
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center
                 rounded-tl-3xl rounded-tr-3xl
                 box-border text-neutral-900 gap-x-10 h-28 py-8 px-12
                 relative w-full bg-white"
    >
      {/* 1. Logo Section (unchanged) */}
      <h1 className="text-4xl font-bold h-9 flex items-center justify-center leading-8 w-44">
        <Link to="/" className="flex items-center cursor-pointer h-9 relative w-44">
          <img
            src="https://he9uk1-eq.myshopify.com/cdn/shop/files/uah_connect.svg?v=1741182231&width=241"
            className="max-h-[2.13rem] max-w-full w-44 hidden overflow-clip md:block"
            alt="UAH Connect Logo" width={176} height={34}
          />
        </Link>
      </h1>

      {/* 2. Navigation Section */}
      <div className="w-full h-11 hidden lg:flex justify-start items-center">
        <nav className="flex items-center h-11">
          <ul className="flex items-center h-11 list-none gap-x-5">
            {/* Marketplace Item */}
            {marketplaceMenuData && (
              <li
                className="h-11 w-36 list-item relative"
                onMouseEnter={() => handleTriggerEnter(marketplaceMenuData)}
                onMouseLeave={handleGenericLeave}
              >
                <div
                  className="h-11 list-inside list-none w-36 cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={activeTriggerText === marketplaceMenuData.triggerText && isDropdownShellVisible}
                >
                  <div className="items-center text-lg font-medium h-11 px-5 relative w-36 flex rounded-full overflow-hidden group">
                    <span className="items-center h-full justify-center relative w-full flex gap-2 pointer-events-none">
                      {marketplaceMenuData.triggerText}
                    </span>
                    <span className={`items-center bg-neutral-900 text-white h-full justify-center px-5 absolute inset-0 z-[1] flex rounded-full gap-2 transition-opacity pointer-events-none
                                      ${activeTriggerText === marketplaceMenuData.triggerText ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {marketplaceMenuData.triggerText}
                    </span>
                  </div>
                </div>
              </li>
            )}

            {/* Connect Item */}
            {connectMenuData && (
              <li
                className="h-11 w-28 list-item relative"
                onMouseEnter={() => handleTriggerEnter(connectMenuData)}
                onMouseLeave={handleGenericLeave}
              >
                <div
                  className="h-11 list-inside list-none w-28 cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={activeTriggerText === connectMenuData.triggerText && isDropdownShellVisible}
                >
                  <div className="items-center text-lg font-medium h-11 px-5 relative w-28 flex rounded-full overflow-hidden group">
                    <span className="items-center h-full justify-center relative w-full flex gap-2 pointer-events-none">
                      {connectMenuData.triggerText}
                    </span>
                    <span className={`items-center bg-neutral-900 text-white h-full justify-center px-5 absolute inset-0 z-[1] flex rounded-full gap-2 transition-opacity pointer-events-none
                                      ${activeTriggerText === connectMenuData.triggerText ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {connectMenuData.triggerText}
                    </span>
                  </div>
                </div>
              </li>
            )}
             {!connectMenuData && ( /* Fallback if connectMenuData is not provided */
                <li className="h-11 w-28 list-item">
                    <Link to="/connect" className="items-center text-lg font-medium h-11 px-5 relative w-28 flex rounded-full overflow-hidden group">
                        <span className="items-center h-full justify-center relative w-full flex gap-2 pointer-events-none">Connect</span>
                        <span className="items-center bg-neutral-900 text-white h-full justify-center px-5 absolute inset-0 z-[1] flex rounded-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Connect</span>
                    </Link>
                </li>
             )}

            <li className="h-11 w-24 list-item">
              <Link
                to="/pages/contact"
                className="items-center text-lg font-medium h-11 px-5 relative w-24 flex rounded-full overflow-hidden group"
              >
                <span className="items-center h-full justify-center relative w-full flex gap-2 pointer-events-none">Kontakt</span>
                <span className="items-center bg-neutral-900 text-white h-full justify-center px-5 absolute inset-0 z-[1] flex rounded-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Kontakt</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 3. Icons Section (unchanged) */}
      <div className="h-11 flex justify-end items-center"> {/* ... */} </div>

      {/* Mega Menu Dropdown Shell - Animated */}
      <div
          className={`absolute top-full left-0 w-full bg-white shadow-xl rounded-b-3xl z-40
                      overflow-hidden origin-top 
                      transition-all ease-in-out
                      ${isDropdownShellVisible
                        ? 'opacity-100 translate-y-0' // Drives down
                        : 'opacity-0 -translate-y-2 pointer-events-none' // Drives up (short distance)
                      }`}
          style={{ transitionDuration: `${DROPDOWN_ANIMATION_DURATION}ms` }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleGenericLeave}
        >
          {/* Inner content wrapper - key ensures re-animation on content change */}
          {currentVisibleMenu && (
            <div
              key={contentAnimationKey} // This is crucial for content re-animation
              className="max-w-7xl mx-auto px-12 py-10 animate-content-enter" // Apply column animation here
              style={{ animationDuration: `${CONTENT_ANIMATION_DURATION}ms` }}
            >
              <div className={`grid grid-cols-1 md:grid-cols-2 ${
                  currentVisibleMenu.columns.length >= 4 ? 'lg:grid-cols-4' :
                  currentVisibleMenu.columns.length === 3 ? 'lg:grid-cols-3' :
                  'lg:grid-cols-2'
              } gap-x-8 gap-y-10`}>
                {currentVisibleMenu.columns.map((column, index) => (
                  <div key={index}> {/* Columns themselves don't need individual animation class if parent has it */}
                    <h3 className="text-base font-bold text-neutral-900 mb-5">{column.title}</h3>
                    <ul className="space-y-3">
                      {column.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            to={link.href}
                            className="text-sm text-neutral-700 hover:text-neutral-900 hover:underline"
                            onClick={onLinkClickAndCloseMenu}
                          >
                            {link.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {currentVisibleMenu.footerLink && (
                <div className="mt-10 pt-6 border-t border-neutral-200">
                  <Link
                    to={currentVisibleMenu.footerLink.href}
                    className="flex items-center justify-start text-base font-bold text-neutral-900 hover:underline group/footer"
                    onClick={onLinkClickAndCloseMenu}
                  >
                    {currentVisibleMenu.footerLink.text}
                    <ArrowRightIcon />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
    </header>
  );
}