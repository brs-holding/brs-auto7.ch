import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Car, User, Globe, LogOut } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).optional(),
});

type AuthForm = z.infer<typeof authSchema>;

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { t, i18n } = useTranslation();
  const { user, login, logout, register } = useUser();
  const { toast } = useToast();

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const handleSubmit = async (data: AuthForm) => {
    try {
      if (isLoginMode) {
        await login(data);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        await register(data);
        toast({
          title: "Success",
          description: "Registered successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary mr-8">Auto7.ch</a>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("de")}>
                  {t("language.de")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                  {t("language.en")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("fr")}>
                  {t("language.fr")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("it")}>
                  {t("language.it")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons / User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex gap-2">
                    <User className="h-5 w-5" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/register-car">
                    <DropdownMenuItem>
                      <Car className="h-4 w-4 mr-2" />
                      Register Car
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="hidden md:flex">
                    Login / Register
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isLoginMode ? "Login" : "Register"}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {!isLoginMode && (
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col gap-4">
                        <Button type="submit">
                          {isLoginMode ? "Login" : "Register"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsLoginMode(!isLoginMode)}
                        >
                          {isLoginMode
                            ? "Don't have an account? Register"
                            : "Already have an account? Login"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/search">
                <a className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md">
                  <Car className="h-4 w-4 mr-2" />
                  {t("nav.vehicles")}
                </a>
              </Link>
              <Link href="/dealerships">
                <a className="px-4 py-2 hover:bg-gray-100 rounded-md">
                  {t("nav.dealerships")}
                </a>
              </Link>
              {user ? (
                <>
                  <Link href="/register-car">
                    <a className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md">
                      <Car className="h-4 w-4 mr-2" />
                      Register Car
                    </a>
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start px-4 py-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" className="w-full">
                      Login / Register
                    </Button>
                  </DialogTrigger>
                  {/* Dialog content same as desktop version */}
                </Dialog>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}