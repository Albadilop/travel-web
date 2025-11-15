import { Button } from "@/components/ui/button";
import AddCityDialog from "@/components/AddCityDialog";
import LanguageSelector from "@/components/LanguageSelector";
import { MapPin, User, Plus, Menu, LogOut, X, Map } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-card">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-warm rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-poppins text-foreground">
              Travel Diary
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/map">
                  <Button variant="ghost" className="rounded-full text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                    <Map className="h-4 w-4 mr-2" />
                    {t('nav.myMap')}
                  </Button>
                </Link>
                <Link to="/cities">
                  <Button variant="ghost" className="rounded-full text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                    <MapPin className="h-4 w-4 mr-2" />
                    {t('nav.myCities')}
                  </Button>
                </Link>
              </>
            )}
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="rounded-full text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.signOut')}
                </Button>
                <AddCityDialog />
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="rounded-full text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                  <User className="h-4 w-4 mr-2" />
                  {t('nav.signIn')}
                </Button>
              </Link>
            )}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col gap-2">
              {user && (
                <>
                  <Link 
                    to="/map" 
                    className="px-4 py-2 text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Map className="h-4 w-4" />
                    {t('nav.myMap')}
                  </Link>
                  <Link 
                    to="/cities" 
                    className="px-4 py-2 text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MapPin className="h-4 w-4" />
                    {t('nav.myCities')}
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <AddCityDialog />
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="px-4 py-2 text-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {t('nav.signIn')}
                </Link>
              )}
              <div className="px-4 py-2">
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;