import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/ServiceDetailClient";

// =====================================================
// VALID SERVICE KEYS (DEFINED IN SERVER COMPONENT)
// =====================================================
const validServiceKeys = [
  "online-medicine",
  "blood-test",
  "online-doctor-consultation",
  "personal-accident-covered",
  "hospicase",
  "contact-us",
  "certificate"
] as const;

export type ServiceKey = (typeof validServiceKeys)[number];

// =====================================================
// STATIC PARAMS
// =====================================================
export function generateStaticParams() {
  return validServiceKeys.map((service) => ({
    service,
  }));
}

// =====================================================
// SERVICE PAGE
// =====================================================
export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;

  if (!validServiceKeys.includes(service as ServiceKey)) {
    notFound();
  }

  return (
    <main>
      <ServiceDetailClient service={service} />
    </main>
  );
}