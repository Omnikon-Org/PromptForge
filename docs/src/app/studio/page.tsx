import { constructMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import StudioPageClient from './page-client';

export const metadata = constructMetadata({
  title: 'PromptForge Studio',
  description:
    'The interactive Prompt IDE, Compiler, and Testing Environment. Validate, compile, and optimize your prompts before writing any application code.',
});

export default function StudioPage() {
  return (
    <>
      <JsonLd
        type="SoftwareApplication"
        data={{
          name: 'PromptForge Studio',
          description: metadata.description,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
        }}
      />
      <StudioPageClient />
    </>
  );
}
