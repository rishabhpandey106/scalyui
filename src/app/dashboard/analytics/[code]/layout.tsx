import { Metadata } from 'next';

type Props = {
  params: Promise<{ code: string }>;
  children: React.ReactNode;
};

// Next.js automatically calls this function to generate dynamic meta tags
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const code = resolvedParams.code;

  return {
    title: `Analytics for /${code}`,
    description: `View real-time click analytics, locations, and referrer data for the shortened URL scaly.itsrishabh.tech/${code}.`,
    openGraph: {
      title: `Analytics for /${code} | Scaly`,
      description: `View real-time click analytics, locations, and referrer data for the shortened URL scaly.itsrishabh.tech/${code}.`,
      url: `https://scalyui.itsrishabh.tech/dashboard/analytics/${code}`,
      images: [
        {
          url: "https://scalyui.itsrishabh.tech/og-analytics.png", // Example dynamic image
          width: 1200,
          height: 630,
          alt: `Analytics for ${code}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Analytics for /${code} | Scaly`,
      description: `View real-time click analytics, locations, and referrer data for the shortened URL scaly.itsrishabh.tech/${code}.`,
      images: ["https://scalyui.itsrishabh.tech/og-analytics.png"],
    },
  };
}

export default async function AnalyticsLayout({ params, children }: Props) {
  return <>{children}</>;
}
