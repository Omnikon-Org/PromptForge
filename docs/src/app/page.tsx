import { constructMetadata } from '@/lib/metadata';
import HomeClient from './page-client';

export const metadata = constructMetadata({
  title: 'Engineer Better AI Prompts',
  description:
    'The TypeScript Toolkit for Prompt Engineering. Replace fragile string templates with a modern developer workflow.',
});

export default function Home() {
  return <HomeClient />;
}
