'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useShouldRender } from '@/hooks/useShouldRender';
import { SearchDialog } from '../dialog/search-dialog/SearchDialog';
import { extractCategory } from '@/helpers';
import { noStatesDropdownRoutes } from '.';
import LanguageSelector from './LanguageSelector';
import { useIsMobile } from '@/hooks/use-mobile';
import { LocationDialog } from '../dialog/location-dialog/LocationDialog';
import { useEffect, useState } from 'react';
import { AlignRight, User, } from 'lucide-react';
import { Button } from '../ui/button';
import RegisterLinkButton from '../common/RegisterLinkButton';
import RideRentNavbarLogo from '../common/RideRentNavbarLogo';
import { LoginDialog } from '../dialog/login-dialog';
// import { LoginDialog } from '../dialog/login-dialog/LoginDialog';

// dynamic import for sidebar
const MobileSidebar = dynamic(() => import('../sidebar/MobileSidebar'), {
  loading: () => (
    // fallback while loading sidebar
    <Button className="border-none outline-none" size="icon" disabled>
      <AlignRight className="h-6 w-6" />
      <span className="sr-only">Toggle navigation</span>
    </Button>
  ),
});

export const Navbar = () => {
  const params = useParams<{
    state: string;
    category: string;
    country: string;
  }>();

  const country = (params?.country as string) || 'ae';

  const [state, setState] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    // Check if param values exist
    const paramState = params?.state as string | undefined;
    const paramCategory = params?.category as string | undefined;

    // If present in params, store in localStorage
    if (paramState) {
      localStorage.setItem('state', paramState);
    }
    if (paramCategory) {
      localStorage.setItem('category', paramCategory);
    }

    // Fallback order: params → localStorage → default
    const storedState = localStorage.getItem('state');
    const storedCategory = localStorage.getItem('category');

    const finalState =
      paramState || storedState || (country === 'in' ? 'bangalore' : 'dubai');

    const finalCategory = paramCategory || storedCategory || 'cars';

    setState(finalState);
    setCategory(extractCategory(finalCategory));
  }, [params, country]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Save to localStorage
          sessionStorage.setItem(
            'userLocation',
            JSON.stringify({ latitude, longitude })
          );
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.warn('Geolocation is not supported');
    }
  }, []);

  const shouldRenderDropdowns = useShouldRender(noStatesDropdownRoutes);

  const isMobile = useIsMobile(640);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 flex h-[4rem] flex-col items-center justify-center gap-y-5 border-b bg-white transition-all duration-200 ease-in-out`}
    >
      <nav className={`flex-between global-padding container`}>
        <div className="flex w-fit items-center justify-center">
          <div className="w-fit p-0">
            <RideRentNavbarLogo
              country={country}
              state={state}
              category={category}
            />
          </div>
        </div>

        <div className="flex w-fit items-center">
          <ul className="flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-5">
            {/* Search Dialog */}
            <li>
              <SearchDialog state={state} category={category} />
            </li>

            <li>
              <LanguageSelector
                theme="navbar"
                size="md"
                showLanguageText={true}
                position="left"
                className="navbar-lang-selector"
              />
            </li>

            {/* Location */}
            {!shouldRenderDropdowns && (
              <li className="-mx-2 w-fit">
                <LocationDialog />
              </li>
            )}

            {/* List Button */}
            <li className="hidden lg:block">
              <RegisterLinkButton country={country} />
            </li>

            {/* Login/Signup Icon */}
            <li className="max-sm:hidden">
              {/* Login Dialog with required props */}
              {(() => {
                const [isLoginOpen, setLoginOpen] = useState(false);
                return (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setLoginOpen(true)}
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">Login / Sign Up</span>
                    </Button>
                    <LoginDialog
                      isOpen={isLoginOpen}
                      onClose={() => setLoginOpen(false)}
                    />
                  </>
                );
              })()}
            </li>

            {/* <li className="max-sm:hidden">
              <ProfileDropdown />
            </li> */}

            {isMobile && (
              <li>
                <MobileSidebar />
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};
