
"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useAppContext } from "@/context/app-context"
import { Locale } from "@/lib/i18n"
import { Currency } from "@/context/app-context"

export function AppHeader() {
  const { language, setLanguage, currency, setCurrency } = useAppContext();

  const handleLanguageChange = (lang: Locale) => {
    setLanguage(lang);
    const currencyMap: Record<Locale, Currency> = {
      'en': 'USD',
      'bn': 'BDT',
      'es': 'EUR',
      'hi': 'INR'
    };
    setCurrency(currencyMap[lang]);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.Logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              Onearn Platform
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Icons.Languages className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{language.t('languageCurrency')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={language.locale} onValueChange={(value) => handleLanguageChange(value as Locale)}>
                        <DropdownMenuRadioItem value="en">English (USD)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bn">বাংলা (BDT)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="es">Español (EUR)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="hi">हिन्दी (INR)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="@user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Icons.Profile className="mr-2 h-4 w-4" />
                  <span>{language.t('profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/account">
                  <Icons.Settings className="mr-2 h-4 w-4" />
                  <span>{language.t('settings')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Icons.Logout className="mr-2 h-4 w-4" />
                <span>{language.t('logOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
