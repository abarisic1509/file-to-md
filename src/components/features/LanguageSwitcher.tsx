'use client';

import { Check, Languages } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SupportedLocale } from '@/lib/i18n/i18nSettings';
import changeSSRLanguage from '@/lib/i18n/languageSwitcherAction';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
	languages: SupportedLocale[];
}

export const LanguageSwitcher = ({ languages }: LanguageSwitcherProps) => {
	const { i18n, t } = useTranslation();
	const [open, setOpen] = useState(false);

	const changeLanguage = async (code: string) => {
		if (code === i18n.resolvedLanguage) return;

		setOpen(false);
		i18n.changeLanguage(code);
		await changeSSRLanguage(code);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger render={<Button variant="ghost" size="default" className="gap-1.5 px-2 py-1.5" />}>
				<Languages className="size-4" />
				<span className="text-xs uppercase leading-tight">{t('language')}</span>
			</PopoverTrigger>
			<PopoverContent align="center" side="bottom" className="w-40 p-1">
				<div className="max-h-64 overflow-y-auto">
					{languages.map((code) => {
						const isActive = code === i18n.resolvedLanguage;

						return (
							<button
								key={code}
								type="button"
								onClick={() => changeLanguage(code)}
								className={cn(
									'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
									'hover:bg-accent hover:text-accent-foreground',
									'focus-visible:bg-accent focus-visible:text-accent-foreground',
									isActive && 'font-medium'
								)}
							>
								<Check className={cn('size-3.5 shrink-0', !isActive && 'invisible')} />
								<span className="uppercase">{code}</span>
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
};
