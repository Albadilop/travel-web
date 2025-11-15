import { Button } from "@/components/ui/button";
import AddCityDialog from "@/components/AddCityDialog";
import { MapPin, User, Plus, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
            <Link to="/map">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Mi Mapa
              </Button>
            </Link>
            <Link to="/cities">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Mis Ciudades
              </Button>
            </Link>
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
                <AddCityDialog />
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;