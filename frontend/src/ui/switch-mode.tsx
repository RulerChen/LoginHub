import { useTheme } from 'next-themes';
import { Switch } from '@nextui-org/react';
import { SunIcon } from '../ui/sun-icon';
import { MoonIcon } from '../ui/moon-icon';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Switch
        isSelected={theme === 'light'}
        onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        size="lg"
        color="primary"
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
      />
    </div>
  );
}
